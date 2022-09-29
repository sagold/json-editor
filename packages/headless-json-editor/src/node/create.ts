import { v4 as uuid } from 'uuid';
import { getTypeOf, Interface as Core, JSONSchema, JSONPointer } from 'json-schema-library';
import { Node, NodeType, ArrayNode, ObjectNode, StringNode, NumberNode, BooleanNode, NullNode } from './types';

type CreateNode = (core: Core, data: any, schema: JSONSchema, pointer: JSONPointer) => Node;

function getOptions(schema: JSONSchema) {
    return {
        title: schema.title,
        description: schema.description,
        disabled: false,
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
        Object.keys(data).forEach((key) => {
            const nextSchema = core.step(key, schema, data, pointer); // not save
            node.children.push(create(core, data[key], nextSchema, `${pointer}/${key}`));
        });
        if (schema.properties) {
            // simplified solution to maintain order as is given by json-schema
            // should probably use combination of additionalProperties, dependencies, etc
            const props = Object.keys(schema.properties);
            node.children.sort((a, b) => props.indexOf(a.property) - props.indexOf(b.property));
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

export function create<T = Node>(
    core: Core,
    data: unknown,
    schema: JSONSchema = core.rootSchema,
    pointer: JSONPointer = '#'
): T {
    const dataType = data == null ? 'null' : getTypeOf(data ?? schema.const);

    if (NODES[dataType]) {
        return NODES[dataType](core, data, schema, pointer);
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}
