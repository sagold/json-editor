import { v4 as uuid } from 'uuid';
import { getTypeOf, Draft, JSONPointer } from 'json-schema-library';
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
import query from 'gson-query';

type CreateNode = (draft: Draft, data: any, schema: JSONSchema, pointer: JSONPointer) => Node;

function getOptions(schema: JSONSchema) {
    return {
        title: schema.title,
        description: schema.description,
        // @ts-ignore
        disabled: schema.isActive === false || false,
        hidden: false,
        ...(schema.options ?? {})
    };
}

function getPropertyName(pointer: string) {
    return pointer.split('/').pop() as string;
}

export const NODES: Record<NodeType, CreateNode> = {
    array: (core, data: unknown[], schema, pointer): ArrayNode => {
        const node: ArrayNode = {
            id: uuid(),
            type: 'array',
            pointer,
            property: getPropertyName(pointer),
            schema,
            options: getOptions(schema),
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
        const node: ObjectNode = {
            id: uuid(),
            type: 'object',
            pointer,
            property: getPropertyName(pointer),
            schema,
            options: getOptions(schema),
            children: [],
            errors: []
        };

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
        if (schema.dependencies) {
            Object.keys(schema.dependencies).forEach((dependentKey) => {
                const additionalSchema = schema.dependencies![dependentKey];
                // ignore if its not a json-schema
                if (getTypeOf(additionalSchema) !== 'object') {
                    return;
                }

                // @ts-ignore
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
                properties = { ...properties, ...(additionalSchema.properties ?? {}) };
                return;
            });
        }

        Object.keys(totalData).forEach((key) => {
            const nextSchema = core.step(key, schema, totalData, pointer); // not save
            node.children.push(create(core, totalData[key], nextSchema, `${pointer}/${key}`));
        });

        if (properties) {
            // simplified solution to maintain order as is given by json-schema
            // should probably use combination of additionalProperties, dependencies, etc
            const props = Object.keys(properties);
            node.children.sort((a, b) => {
                return props.indexOf(a.property) - props.indexOf(b.property);
            });
        }

        if (schema.dependencies) {
            // console.log(node);
        }

        return node;
    },
    string: (core, value: string, schema, pointer): StringNode => {
        const node: StringNode = {
            id: uuid(),
            type: 'string',
            pointer,
            property: getPropertyName(pointer),
            options: getOptions(schema),
            schema,
            value,
            errors: []
        };
        return node;
    },
    number: (core, value: number, schema, pointer): NumberNode => {
        const node: NumberNode = {
            id: uuid(),
            type: 'number',
            pointer,
            property: getPropertyName(pointer),
            options: getOptions(schema),
            schema,
            value,
            errors: []
        };
        return node;
    },
    boolean: (core, value: boolean, schema, pointer): BooleanNode => {
        const node: BooleanNode = {
            id: uuid(),
            type: 'boolean',
            pointer,
            property: getPropertyName(pointer),
            options: getOptions(schema),
            schema,
            value,
            errors: []
        };
        return node;
    },
    null: (core, value: null, schema, pointer): NullNode => {
        const node: NullNode = {
            id: uuid(),
            type: 'null',
            pointer,
            property: getPropertyName(pointer),
            options: getOptions(schema),
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
