import { JSONError } from 'json-schema-library';

export type JSONSchema = Record<string, unknown>;

export type Node = ArrayNode | ObjectNode | StringNode | NumberNode | BooleanNode | NullNode;

export type Change = { type: 'update' | 'create' | 'delete'; node: Node };

/** node type refers to the actual data value - it is not the expected schema type */
export type NodeType = ArrayType | ObjectType | StringType | NumberType | BooleanType | NullType;

export type DefaultNodeOptions = {
    description?: string;
    disabled: boolean;
    hidden: boolean;
    title?: string;
    [o: string]: any;
};

export type ArrayType = 'array';
export type ArrayNode = {
    id: string;
    type: ArrayType;
    children: Node[];
    options: DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};

export type ObjectType = 'object';

export type ObjectNode = {
    id: string;
    type: ObjectType;
    children: Node[];
    options: DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};

export type StringType = 'string';
export type StringNode = {
    id: string;
    type: StringType;
    options: DefaultNodeOptions;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: string;
    errors: JSONError[];
};

export type NumberType = 'number';
export type NumberNode = {
    id: string;
    type: NumberType;
    options: DefaultNodeOptions;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: number;
    errors: JSONError[];
};

export type BooleanType = 'boolean';
export type BooleanNode = {
    id: string;
    type: BooleanType;
    options: DefaultNodeOptions;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: boolean;
    errors: JSONError[];
};

export type NullType = 'null';
export type NullNode = {
    id: string;
    type: NullType;
    options: DefaultNodeOptions;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: null;
    errors: JSONError[];
};

export type ParentNode = ArrayNode | ObjectNode;
export type ValueNode = StringNode | NumberNode | NullNode | BooleanNode;

const NodeTypes = ['array', 'object', 'string', 'number', 'null', 'boolean'] as const;
export function isNode(node): node is Node {
    return NodeTypes.includes(node?.type);
}

export function isParentNode(node: Node | JSONError): node is ObjectNode | ArrayNode {
    return node.type === 'array' || node.type === 'object';
}

export function isValueNode(node: Node | JSONError): node is StringNode | NumberNode | NullNode | BooleanNode {
    return node.type === 'string' || node.type === 'number' || node.type === 'null' || node.type === 'boolean';
}

export { isJSONError } from 'json-schema-library';
