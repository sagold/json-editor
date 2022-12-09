import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Markdown from 'markdown-to-jsx';
import { createRoot } from 'react-dom/client';
import { isJSONError } from 'json-schema-library';
import { get, split, join } from 'gson-pointer';
import { getJsonPointerFromPosition } from './getJsonPointerFromPosition';
const dom = document.createElement('div');
const root = createRoot(dom);
function insertValue(view, completion, from, to) {
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
function getValueCompletions(schema) {
    var _a;
    if (Array.isArray(schema.enum)) {
        return schema.enum.map((v) => {
            var _a;
            return ({
                label: JSON.stringify(v),
                type: 'text',
                info: () => renderInfo(schema),
                detail: (_a = schema.type) !== null && _a !== void 0 ? _a : typeof v,
                apply: insertValue
            });
        });
    }
    if (schema.const) {
        return [
            {
                label: JSON.stringify(schema.const),
                type: 'text',
                info: () => renderInfo(schema),
                detail: (_a = schema.type) !== null && _a !== void 0 ? _a : typeof schema.const,
                apply: insertValue
            }
        ];
    }
    return [];
}
export const jsonSchemaCompletion = (draft, schema) => async function (context) {
    const resolvedCursor = getJsonPointerFromPosition(context.state, context.pos);
    const { location } = resolvedCursor;
    return COMPLETION[location] ? COMPLETION[location](draft, schema, context, resolvedCursor) : null;
};
const COMPLETION = {
    /** completion for array values (array item) */
    array: (draft, schema, context, { pointer }) => {
        const parentSchema = draft.getSchema(pointer, getData(context), schema);
        if (isJSONError(parentSchema)) {
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
            return {
                from: context.pos,
                options: options.map((s, index) => ({
                    label: s.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(s),
                    detail: s.type,
                    apply: JSON.stringify(draft.getTemplate(undefined, s))
                }))
            };
        }
        if (isObject(parentSchema.items)) {
            const itemSchema = parentSchema.items;
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
        var _a;
        const data = getData(context);
        const targetData = (_a = get(data, pointer)) !== null && _a !== void 0 ? _a : {};
        const parentSchema = draft.getSchema(pointer, data, schema);
        if (isJSONError(parentSchema)) {
            console.log(`failed resolving completion of 'object' on ${pointer}`, parentSchema);
            return null;
        }
        const options = [];
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
            }
            else if (propertySchema.enum) {
                initialValue = propertySchema.enum[0];
            }
            else {
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
        const targetSchema = draft.getSchema(pointer, data, schema);
        if (isJSONError(targetSchema)) {
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
        var _a;
        const parentPointer = getParentPointer(pointer);
        const data = getData(context);
        const targetData = (_a = get(data, pointer)) !== null && _a !== void 0 ? _a : {};
        const parentSchema = draft.getSchema(parentPointer, data, schema);
        if (isJSONError(parentSchema)) {
            console.log(`failed resolving completion of 'property' on ${pointer}`, parentSchema);
            return null;
        }
        const options = [];
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
        const schemaOfLocation = draft.getSchema(pointer, data, schema);
        if (isJSONError(schemaOfLocation)) {
            console.log(`failed resolving completion of 'value' on ${pointer}`, schemaOfLocation);
            return null;
        }
        if (schemaOfLocation.items && schemaOfLocation.items.oneOf) {
            const options = draft.getChildSchemaSelection(0, schemaOfLocation);
            return {
                from: context.pos,
                options: options.map((s, index) => ({
                    label: s.title || `${index + 1}. item (no title defined)`,
                    type: 'text',
                    info: () => renderInfo(s),
                    detail: s.type,
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
function renderInfo(schema) {
    if (schema == null || (schema.title == null && schema.description == null)) {
        return null;
    }
    root.render(_jsxs("div", { className: "rje-tooltip rje-tooltip--jsonschema", children: [schema.title && _jsx("h1", { children: schema.title }), schema.description && _jsx(Markdown, { children: schema.description })] }));
    return dom;
}
function getParentPointer(pointer) {
    const fragments = split(pointer);
    fragments.pop();
    return join(fragments);
}
function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
function getData(context) {
    try {
        return JSON.parse(context.state.doc.toString());
    }
    catch (e) {
        return undefined;
    }
}
//# sourceMappingURL=jsonSchemaCompletion.js.map