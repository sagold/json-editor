import Markdown from 'markdown-to-jsx';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { createRoot } from 'react-dom/client';
import { Draft } from 'json-schema-library';
import { get, split, join } from 'gson-pointer';
import { getJsonPointerFromPosition, CursorLocationType, JsonPointerLocation } from './getJsonPointerFromPosition';
import { JSONSchema } from '@sagold/react-json-editor';

const dom = document.createElement('div');
const root = createRoot(dom);

function renderInfo(schema?: JSONSchema) {
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

type CompletionReturnValue = null | {
    from: number;
    options: Completion[];
};

type GetCompletions = (
    draft: Draft,
    schema: JSONSchema,
    context: CompletionContext,
    jpl: JsonPointerLocation
) => CompletionReturnValue;

const COMPLETION: Record<CursorLocationType, GetCompletions> = {
    /** completion for array values (array item) */
    array: (draft, schema, context, { pointer }) => {
        const parentSchema = draft.getSchema(pointer, getData(context), schema);
        if (isObject(parentSchema.items)) {
            const itemSchema = parentSchema.items as JSONSchema;
            const value = draft.getTemplate(undefined, itemSchema);
            return {
                from: context.pos,
                options: [
                    {
                        label: JSON.stringify(value),
                        type: 'text',
                        info: () => renderInfo(itemSchema),
                        detail: itemSchema.type,
                        apply: JSON.stringify(value)
                    }
                ]
            };
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
        return null;
    },
    /** completion for an object property */
    object: (draft, schema, context, { pointer }) => {
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const parentSchema = draft.getSchema(pointer, data, schema);
        const options: Completion[] = [];
        Object.keys(parentSchema.properties).forEach((prop) => {
            if (targetData[prop] !== undefined) {
                // do not offer existing properties in completion. target data
                // is only valid in rare situations (where json is valid)
                return;
            }
            const propertySchema = parentSchema.properties[prop];
            const templateData = draft.getTemplate(undefined, propertySchema);
            options.push({
                label: `"${prop}"`,
                type: 'keyword',
                info: () => renderInfo(propertySchema),
                detail: propertySchema.type,
                apply: `"${prop}": ${JSON.stringify(templateData)},`
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
        const targetSchema = draft.getSchema(pointer, data, schema);
        const value = draft.getTemplate(undefined, targetSchema);
        const completions = {
            from: context.pos,
            options: [
                {
                    label: JSON.stringify(value),
                    type: 'text',
                    info: () => renderInfo(schema),
                    detail: schema.type as string,
                    apply: `${JSON.stringify(value)},`
                }
            ]
        };
        return completions;
    },
    /** completion for partial property name (within quotes) */
    property: (draft, schema, context, { pointer, cursor }) => {
        const parentPointer = getParentPointer(pointer);
        const data = getData(context);
        const targetData = get(data, pointer) ?? {};
        const parentSchema = draft.getSchema(parentPointer, data, schema);
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
        return {
            from: cursor.from + 1,
            options
        };
    },
    /** completion for a partial value */
    value: () => null
};

export const jsonSchemaCompletion = (draft: Draft, schema: JSONSchema) =>
    function (context: CompletionContext) {
        const resolvedCursor = getJsonPointerFromPosition(context.state, context.pos);
        const { location } = resolvedCursor;
        return COMPLETION[location] ? COMPLETION[location](draft, schema, context, resolvedCursor) : null;
    };
