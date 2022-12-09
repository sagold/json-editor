import { v4 as uuid } from 'uuid';
import { getTypeOf, isJSONError } from 'json-schema-library';
export function getOptions(schema, property) {
    var _a;
    const uiOptions = (_a = schema.options) !== null && _a !== void 0 ? _a : {};
    const options = {
        title: schema.title || property,
        description: schema.description,
        disabled: schema.isActive === false || false,
        hidden: false,
        ...uiOptions
    };
    if (uiOptions.showTitle === false) {
        delete options.title;
    }
    if (uiOptions.showDescription === false) {
        delete options.description;
    }
    return options;
}
function getPropertyName(pointer) {
    return pointer.split('/').pop();
}
function isObject(v) {
    return getTypeOf(v) === 'object';
}
export const NODES = {
    array: (core, data, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'array',
            pointer,
            property,
            schema,
            options: {
                ...getOptions(schema, property),
                required: schema.minItems != null && schema.minItems > 0
            },
            children: [],
            errors: []
        };
        data.forEach((next, key) => {
            const nextSchema = core.step(key, schema, data, pointer); // not save
            node.children.push(create(core, next, nextSchema, `${pointer}/${key}`));
        });
        return node;
    },
    object: (core, data, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'object',
            pointer,
            property,
            schema,
            options: getOptions(schema, property),
            children: [],
            errors: []
        };
        if (schema.allOf) {
            schema = core.resolveAllOf(data, schema);
            data = core.getTemplate(data, schema);
        }
        /**
         * if there are dependencies
         * - we need at least to flag the schema:
         *     1. if it is active (an active flag indicates a dynamic property)
         * - create nodes for all schemas
         *
         * consider to move this to json-schema-library
         */
        let totalData = data;
        let properties = schema.properties;
        if (isObject(schema.dependencies)) {
            const dependencies = schema.dependencies;
            Object.keys(dependencies).forEach((dependentKey) => {
                var _a, _b;
                const additionalSchema = dependencies[dependentKey];
                // ignore if its not a json-schema
                if (!isObject(additionalSchema)) {
                    return;
                }
                additionalSchema.type = 'object';
                const testValue = data[dependentKey];
                const isActive = typeof testValue === 'string' ? testValue.length > 0 : testValue != null;
                const additionalData = core.getTemplate({}, additionalSchema);
                totalData = { ...additionalData, ...data };
                // @ts-ignore
                Object.keys(additionalSchema.properties).forEach((key) => {
                    // @ts-ignore
                    additionalSchema.properties[key].isActive = isActive;
                    // @ts-ignore
                    additionalSchema.properties[key].isDynamic = true;
                });
                // @ts-ignore
                properties = { ...properties, ...((_a = additionalSchema.properties) !== null && _a !== void 0 ? _a : {}) };
                const source = Object.keys(properties);
                const additional = Object.keys((_b = additionalSchema.properties) !== null && _b !== void 0 ? _b : {});
                const newProperties = {};
                for (let i = 0; i < source.length; i += 1) {
                    const name = source[i];
                    // @ts-ignore
                    newProperties[name] = properties[name];
                    if (name === dependentKey) {
                        additional.forEach((key) => {
                            // @ts-ignore
                            newProperties[key] = additionalSchema.properties[key];
                        });
                    }
                }
                properties = newProperties;
                return;
            });
        }
        if (isObject(schema.if) && (schema.then || schema.else)) {
            const isValid = core.isValid(totalData, schema.if);
            const dynamicSchema = (isValid && schema.then) || (!isValid && schema.else);
            if (isObject(dynamicSchema)) {
                const dynamicProperties = dynamicSchema.properties;
                if (isObject(dynamicProperties)) {
                    const additionalData = core.getTemplate({}, { type: 'object', ...dynamicSchema });
                    totalData = { ...additionalData, ...totalData };
                    // @ts-ignore
                    properties = { ...properties, ...dynamicProperties };
                }
            }
        }
        Object.keys(totalData).forEach((key) => {
            const nextSchema = core.step(key, schema, totalData, pointer); // not save
            if (!isJSONError(nextSchema)) {
                node.children.push(create(core, totalData[key], nextSchema, `${pointer}/${key}`));
            }
        });
        if (properties) {
            // simplified solution to maintain order as is given by json-schema
            // should probably use combination of additionalProperties, dependencies, etc
            const props = Object.keys(properties);
            console.log('sort props', props);
            node.children.sort((a, b) => {
                return props.indexOf(a.property) - props.indexOf(b.property);
            });
        }
        return node;
    },
    string: (core, value, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'string',
            pointer,
            property,
            options: {
                ...getOptions(schema, property),
                required: schema.minLength != null && schema.minLength > 0
            },
            schema,
            value,
            errors: []
        };
        return node;
    },
    number: (core, value, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'number',
            pointer,
            property,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    },
    boolean: (core, value, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'boolean',
            pointer,
            property,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    },
    null: (core, value, schema, pointer) => {
        const property = getPropertyName(pointer);
        const node = {
            id: uuid(),
            type: 'null',
            pointer,
            property,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    }
};
export function create(draft, data, schema = draft.rootSchema, pointer = '#') {
    const dataType = data == null ? 'null' : getTypeOf(data !== null && data !== void 0 ? data : schema.const);
    if (NODES[dataType]) {
        return NODES[dataType](draft, data, schema, pointer);
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}
//# sourceMappingURL=create.js.map