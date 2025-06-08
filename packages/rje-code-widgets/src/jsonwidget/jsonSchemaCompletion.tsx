import Markdown from 'markdown-to-jsx';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { createRoot } from 'react-dom/client';
import { isJsonError } from 'json-schema-library';
import { EditorView } from '@codemirror/view';
import { get, split, join } from '@sagold/json-pointer';
import { getJsonPointerFromPosition, CursorLocationType, JsonPointerLocation } from './getJsonPointerFromPosition';
import { JsonSchema } from '@sagold/react-json-editor';
import { SchemaNode } from 'headless-json-editor';

const dom = document.createElement('div');
const root = createRoot(dom);

function insertValue(view: EditorView, completion: Completion, from: number, to: number) {
    let end = to;
    const currentValue = view.state.doc.sliceString(from, to);
    if (currentValue.startsWith('"')) {
        end += 1;
    }
    view.dispatch({
        selection: { anchor: from + completion.label.length, head: from + completion.label.length },
        changes: [
            {
                from,
                to: end,
                insert: completion.label
            }
        ]
    });
}

function getValueCompletions(schema: JsonSchema): Completion[] {
    if (Array.isArray(schema.enum)) {
        return schema.enum.map((v) => ({
            label: JSON.stringify(v),
            type: 'text',
            info: () => renderInfo(schema),
            detail: (schema.type as string) ?? typeof v,
            apply: insertValue
        }));
    }
    if (schema.const) {
        return [
            {
                label: JSON.stringify(schema.const),
                type: 'text',
                info: () => renderInfo(schema),
                detail: (schema.type as string) ?? typeof schema.const,
                apply: insertValue
            }
        ];
    }
    return [];
}

export const jsonSchemaCompletion = (node: SchemaNode) =>
    async function (context: CompletionContext) {
        const resolvedCursor = getJsonPointerFromPosition(context.state, context.pos);
        const { location } = resolvedCursor;
        return COMPLETION[location] ? COMPLETION[location](node, context, resolvedCursor) : null;
    };

type CompletionReturnValue = null | {
    from: number;
    options: Completion[];
};

type GetCompletions = (node: SchemaNode, context: CompletionContext, jpl: JsonPointerLocation) => CompletionReturnValue;

const COMPLETION: Record<CursorLocationType, GetCompletions> = {
    /** completion for array values (array item) */
    array: (node, context, { pointer }) => {
        const { node: parentNode } = node.getNode(pointer, getData(context));
        if (!parentNode) {
            console.log(`failed resolving completion of 'array' on ${pointer}`, node.schema);
            return null;
        }
        if (parentNode.prefixItems) {
            return {
                from: context.pos,
                options: parentNode.prefixItems.map((node) => {
                    const value = node.getData();
                    return {
                        label: JSON.stringify(value),
                        type: 'text',
                        info: () => renderInfo(node.schema),
                        detail: node.schema.type,
                        apply: JSON.stringify(value)
                    };
                })
            };
        }
        if (parentNode.items?.oneOf) {
            const options = parentNode.getChildSelection(0);
            if (isJsonError(options)) {
                return null;
            }
            return {
                from: context.pos,
                options: options.map((itemNode, index) => ({
                    label: itemNode.schema.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(itemNode.schema),
                    detail: itemNode.schema.type,
                    apply: JSON.stringify(itemNode.getData())
                }))
            };
        }
        if (parentNode.items) {
            return {
                from: context.pos,
                options: getValueCompletions(parentNode.items.schema)
            };
        }
        return null;
    },
    /** completion for an object property */
    object: (node, context, { pointer }) => {
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const { node: parentNode } = node.getNode(pointer, data);
        if (!parentNode) {
            console.log(`failed resolving completion of 'object' on ${pointer}`, node.schema);
            return null;
        }
        const options: Completion[] = [];
        Object.keys(parentNode.properties ?? {}).forEach((prop) => {
            if (targetData[prop] !== undefined) {
                // do not offer existing properties in completion. target data
                // is only valid in rare situations (where json is valid)
                return;
            }
            const propertyNode = parentNode.properties![prop];
            let initialValue;
            if (propertyNode.schema.const) {
                initialValue = propertyNode.schema.const;
            } else if (propertyNode.schema.enum) {
                initialValue = propertyNode.schema.enum[0];
            } else {
                initialValue = propertyNode.getData();
            }

            options.push({
                label: `"${prop}"`,
                type: 'keyword',
                info: () => renderInfo(propertyNode.schema),
                detail: propertyNode.schema.type,
                apply: `"${prop}": ${JSON.stringify(initialValue)}`
            });
        });
        return {
            from: context.pos,
            options
        };
    },
    /** completion for a value, where no value is given */
    outside: (node, context, { pointer }) => {
        const data = getData(context);
        const { node: targetNode } = node.getNode(pointer, data);
        if (!targetNode) {
            console.log(`failed resolving completion of 'outside' on ${pointer}`, node.schema);
            return null;
        }
        const completions = {
            from: context.pos,
            options: getValueCompletions(targetNode.schema)
        };
        return completions;
    },
    /** completion for partial property name (within quotes) */
    property: (node, context, { pointer, cursor }) => {
        const parentPointer = getParentPointer(pointer);
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const { node: parentNode } = node.getNode(parentPointer, data);
        if (!parentNode) {
            console.log(`failed resolving completion of 'property' on ${pointer}`, node.schema);
            return null;
        }
        const options: Completion[] = [];
        Object.keys(parentNode.properties ?? {}).forEach((prop) => {
            if (targetData[prop] !== undefined) {
                // do not offer existing properties in completion. target data
                // is only valid in rare situations (where json is valid)
                return;
            }
            const propertyNode = parentNode.properties![prop];
            options.push({
                label: `${prop}`,
                type: 'keyword',
                info: () => renderInfo(propertyNode.schema),
                detail: propertyNode.schema.type
            });
        });
        // console.log('property options', options);
        return {
            from: cursor.from + 1,
            options
        };
    },
    /** completion for a partial value */
    value: (node, context, { pointer, cursor }) => {
        const data = getData(context);

        const { node: locationNode } = node.getNode(pointer, data);
        if (!locationNode) {
            console.log(`failed resolving completion of 'value' on ${pointer}`, node.schema);
            return null;
        }

        if (locationNode.items?.oneOf) {
            const options = locationNode.getChildSelection(0);
            if (isJsonError(options)) {
                return null;
            }
            return {
                from: context.pos,
                options: options.map((childNode, index) => ({
                    label: childNode.schema.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(childNode.schema),
                    detail: childNode.schema.type,
                    apply: JSON.stringify(childNode.getData())
                }))
            };
        }

        return {
            from: cursor.from,
            options: getValueCompletions(locationNode.schema)
        };
    }
};

function renderInfo(schema?: JsonSchema) {
    if (schema == null || (schema.title == null && schema.description == null)) {
        return null;
    }
    root.render(
        <div className="rje-tooltip rje-tooltip--jsonschema">
            {schema.title && <h1>{schema.title}</h1>}
            {schema.description && <Markdown>{schema.description}</Markdown>}
        </div>
    );
    return dom;
}

function getParentPointer(pointer: string) {
    const fragments = split(pointer);
    fragments.pop();
    return join(fragments);
}

function getData(context: CompletionContext) {
    try {
        return JSON.parse(context.state.doc.toString());
    } catch (e) {
        return undefined;
    }
}
