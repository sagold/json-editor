import Markdown from 'markdown-to-jsx';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { createRoot } from 'react-dom/client';
import { Draft, isJsonError } from 'json-schema-library';
import { EditorView } from '@codemirror/view';
import { get, split, join } from '@sagold/json-pointer';
import { getJsonPointerFromPosition, CursorLocationType, JsonPointerLocation } from './getJsonPointerFromPosition';
import { JsonSchema } from '@sagold/react-json-editor';

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

export const jsonSchemaCompletion = (draft: Draft, schema: JsonSchema) =>
    async function (context: CompletionContext) {
        const resolvedCursor = getJsonPointerFromPosition(context.state, context.pos);
        const { location } = resolvedCursor;
        return COMPLETION[location] ? COMPLETION[location](draft, schema, context, resolvedCursor) : null;
    };

type CompletionReturnValue = null | {
    from: number;
    options: Completion[];
};

type GetCompletions = (
    draft: Draft,
    schema: JsonSchema,
    context: CompletionContext,
    jpl: JsonPointerLocation
) => CompletionReturnValue;

const COMPLETION: Record<CursorLocationType, GetCompletions> = {
    /** completion for array values (array item) */
    array: (draft, schema, context, { pointer }) => {
        const parentSchema = draft.getSchema({ pointer, data: getData(context), schema });
        if (!parentSchema || isJsonError(parentSchema)) {
            console.log(`failed resolving completion of 'array' on ${pointer}`, parentSchema);
            return null;
        }
        if (Array.isArray(parentSchema.items)) {
            const itemsSchema = parentSchema.items;
            return {
                from: context.pos,
                options: itemsSchema.map((schema) => {
                    const value = draft.getTemplate(undefined, schema);
                    return {
                        label: JSON.stringify(value),
                        type: 'text',
                        info: () => renderInfo(schema),
                        detail: schema.type,
                        apply: JSON.stringify(value)
                    };
                })
            };
        }
        if (parentSchema.items.oneOf) {
            const options = draft.getChildSchemaSelection(0, parentSchema);
            if (isJsonError(options)) {
                return null;
            }
            return {
                from: context.pos,
                options: options.map((s: JsonSchema, index) => ({
                    label: s.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(s),
                    detail: s.type,
                    apply: JSON.stringify(draft.getTemplate(undefined, s))
                }))
            };
        }
        if (isObject(parentSchema.items)) {
            const itemSchema = parentSchema.items as JsonSchema;
            // console.log('itemSchema', itemSchema);
            // const value = draft.getTemplate(undefined, itemSchema);
            return {
                from: context.pos,
                options: getValueCompletions(itemSchema)
            };
        }
        return null;
    },
    /** completion for an object property */
    object: (draft, schema, context, { pointer }) => {
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const parentSchema = draft.getSchema({ pointer, data, schema });
        if (!parentSchema || isJsonError(parentSchema)) {
            console.log(`failed resolving completion of 'object' on ${pointer}`, parentSchema);
            return null;
        }
        const options: Completion[] = [];
        Object.keys(parentSchema.properties).forEach((prop) => {
            if (targetData[prop] !== undefined) {
                // do not offer existing properties in completion. target data
                // is only valid in rare situations (where json is valid)
                return;
            }
            const propertySchema = parentSchema.properties[prop];
            let initialValue;
            if (propertySchema.const) {
                initialValue = propertySchema.const;
            } else if (propertySchema.enum) {
                initialValue = propertySchema.enum[0];
            } else {
                initialValue = draft.getTemplate(undefined, propertySchema);
            }

            options.push({
                label: `"${prop}"`,
                type: 'keyword',
                info: () => renderInfo(propertySchema),
                detail: propertySchema.type,
                apply: `"${prop}": ${JSON.stringify(initialValue)}`
            });
        });
        return {
            from: context.pos,
            options
        };
    },
    /** completion for a value, where no value is given */
    outside: (draft, schema, context, { pointer }) => {
        const data = getData(context);
        const targetSchema = draft.getSchema({ pointer, data, schema });
        if (!targetSchema || isJsonError(targetSchema)) {
            console.log(`failed resolving completion of 'outside' on ${pointer}`, targetSchema);
            return null;
        }
        const completions = {
            from: context.pos,
            options: getValueCompletions(targetSchema)
        };
        return completions;
    },
    /** completion for partial property name (within quotes) */
    property: (draft, schema, context, { pointer, cursor }) => {
        const parentPointer = getParentPointer(pointer);
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const parentSchema = draft.getSchema({ pointer: parentPointer, data, schema });
        if (!parentSchema || isJsonError(parentSchema)) {
            console.log(`failed resolving completion of 'property' on ${pointer}`, parentSchema);
            return null;
        }
        const options: Completion[] = [];
        Object.keys(parentSchema.properties).forEach((prop) => {
            if (targetData[prop] !== undefined) {
                // do not offer existing properties in completion. target data
                // is only valid in rare situations (where json is valid)
                return;
            }
            const propertySchema = parentSchema.properties[prop];
            options.push({
                label: `${prop}`,
                type: 'keyword',
                info: () => renderInfo(propertySchema),
                detail: propertySchema.type
            });
        });
        // console.log('property options', options);
        return {
            from: cursor.from + 1,
            options
        };
    },
    /** completion for a partial value */
    value: (draft, schema, context, { pointer, cursor }) => {
        const data = getData(context);
        const schemaOfLocation = draft.getSchema({ pointer, data, schema }) as JsonSchema;
        if (!schemaOfLocation || isJsonError(schemaOfLocation)) {
            console.log(`failed resolving completion of 'value' on ${pointer}`, schemaOfLocation);
            return null;
        }

        if (schemaOfLocation.items && (schemaOfLocation.items as JsonSchema).oneOf) {
            const options = draft.getChildSchemaSelection(0, schemaOfLocation);
            if (isJsonError(options)) {
                return null;
            }
            return {
                from: context.pos,
                options: options.map((s: JsonSchema, index) => ({
                    label: s.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(s),
                    detail: s.type as string,
                    apply: JSON.stringify(draft.getTemplate(undefined, s))
                }))
            };
        }

        return {
            from: cursor.from,
            options: getValueCompletions(schemaOfLocation)
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

function isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function getData(context: CompletionContext) {
    try {
        return JSON.parse(context.state.doc.toString());
    } catch (e) {
        return undefined;
    }
}
