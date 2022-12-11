import { v4 as uuid } from 'uuid';
import { getTypeOf, Draft, JSONPointer, isJSONError } from 'json-schema-library';
import {
    Node,
    NodeType,
    ArrayNode,
    ObjectNode,
    StringNode,
    NumberNode,
    BooleanNode,
    NullNode,
    JSONSchema
} from '../types';

export type DefaultNodeOptions = {
    /** additional classnames the ui should add to the root of this data point */
    classNames?: string[];
    /** description of this data point */
    description?: string;
    /** if changes to this data point are disabled */
    disabled: boolean;
    /** if supported, will add a placeholder for the input element */
    placeholder?: string;
    /** if this data point should be hidden from display */
    hidden: boolean;
    /** title of this data point */
    title?: string;
    /** disable edit of form, but allow selection and copy of value */
    readOnly?: boolean;
    required?: boolean;
    [o: string]: unknown;
};

type CreateNode = (draft: Draft, data: any, schema: JSONSchema, pointer: JSONPointer) => Node;

export function getOptions(schema: JSONSchema, property: string) {
    const uiOptions = schema.options ?? {};
    const options: DefaultNodeOptions = {
        title: schema.title || property,
        description: schema.description,
        disabled: false,
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

function getPropertyName(pointer: string) {
    return pointer.split('/').pop() as string;
}

function isObject(v: unknown): v is Record<string, unknown> {
    return getTypeOf(v) === 'object';
}

export const NODES: Record<NodeType, CreateNode> = {
    array: (core, data: unknown[], schema, pointer): ArrayNode => {
        const property = getPropertyName(pointer);
        const node: ArrayNode = {
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
    object: (core, data: Record<string, unknown>, schema, pointer): ObjectNode => {
        const property = getPropertyName(pointer);
        const node: ObjectNode = {
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
        // if (isObject(schema.dependencies)) {
        //     const dependencies: JSONSchema['dependencies'] = schema.dependencies;
        //     Object.keys(dependencies).forEach((dependentKey) => {
        //         const additionalSchema = dependencies[dependentKey];
        //         // ignore if its not a json-schema
        //         if (!isObject(additionalSchema)) {
        //             return;
        //         }

        //         additionalSchema.type = 'object';

        //         const testValue = data[dependentKey];
        //         const isActive = testValue != null;
        //         const additionalData = core.getTemplate({}, additionalSchema);
        //         totalData = { ...additionalData, ...data };

        //         // @ts-ignore
        //         Object.keys(additionalSchema.properties).forEach((key) => {
        //             // @ts-ignore
        //             additionalSchema.properties[key].isActive = isActive;
        //             // @ts-ignore
        //             additionalSchema.properties[key].isDynamic = true;
        //         });

        //         // @ts-ignore
        //         properties = { ...properties, ...(additionalSchema.properties ?? {}) };
        //         const source = Object.keys(properties as object);
        //         const additional = Object.keys((additionalSchema.properties as object) ?? {});
        //         const newProperties: Record<string, any> = {};
        //         for (let i = 0; i < source.length; i += 1) {
        //             const name = source[i];
        //             // @ts-ignore
        //             newProperties[name] = properties[name];
        //             if (name === dependentKey) {
        //                 additional.forEach((key: string) => {
        //                     // @ts-ignore
        //                     newProperties[key] = additionalSchema.properties[key];
        //                 });
        //             }
        //         }
        //         properties = newProperties;
        //         return;
        //     });
        // }

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
            node.children.sort((a, b) => {
                return props.indexOf(a.property) - props.indexOf(b.property);
            });
        }

        return node;
    },
    string: (core, value: string, schema, pointer): StringNode => {
        const property = getPropertyName(pointer);
        const node: StringNode = {
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
    number: (core, value: number, schema, pointer): NumberNode => {
        const property = getPropertyName(pointer);
        const node: NumberNode = {
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
    boolean: (core, value: boolean, schema, pointer): BooleanNode => {
        const property = getPropertyName(pointer);
        const node: BooleanNode = {
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
    null: (core, value: null, schema, pointer): NullNode => {
        const property = getPropertyName(pointer);
        const node: NullNode = {
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

export function create<T extends Node = Node>(
    draft: Draft,
    data: unknown,
    schema: JSONSchema = draft.rootSchema,
    pointer: JSONPointer = '#'
): T {
    const dataType = data == null ? 'null' : (getTypeOf(data ?? schema.const) as NodeType);

    if (NODES[dataType]) {
        return NODES[dataType](draft, data, schema, pointer) as T;
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}
