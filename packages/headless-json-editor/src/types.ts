import { JSONError } from 'json-schema-library';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';

export type JSONSchemaOptions = Record<string, unknown>;
type JSONSchemaDefinition = JSONSchema7Definition & JSONSchemaOptions;

export type JSONSchema =
    | JSONSchema7 & {
          oneOfSchema?: JSONSchema;
          options?: JSONSchemaOptions;
          properties?: { [key: string]: JSONSchemaDefinition };
          patternProperties?: { [key: string]: JSONSchemaDefinition } | undefined;
          additionalProperties?: JSONSchemaDefinition | undefined;
          dependencies?: { [key: string]: JSONSchemaDefinition | string[] } | undefined;
          definitions?: { [key: string]: JSONSchemaDefinition } | undefined;
          allOf?: JSONSchemaDefinition[] | undefined;
          anyOf?: JSONSchemaDefinition[] | undefined;
          oneOf?: JSONSchemaDefinition[] | undefined;
          not?: JSONSchemaDefinition | undefined;
          items?: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined;
          additionalItems?: JSONSchemaDefinition | undefined;
      };

export type Node = ArrayNode | ObjectNode | StringNode | NumberNode | BooleanNode | NullNode;

export type Change = { type: 'update' | 'create' | 'delete'; node: Node };

/** node type refers to the actual data value - it is not the expected schema type */
export type NodeType = ArrayType | ObjectType | StringType | NumberType | BooleanType | NullType;

export type DefaultNodeOptions = {
    description?: string;
    disabled: boolean;
    hidden: boolean;
    title?: string;
    [o: string]: unknown;
};

export type ArrayType = 'array';
export type ArrayNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ArrayType;
    children: Node[];
    options: T;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};

export type ObjectType = 'object';

export type ObjectNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ObjectType;
    children: Node[];
    options: T;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};

export type StringType = 'string';
export type StringNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: StringType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: string;
    errors: JSONError[];
};

export type NumberType = 'number';
export type NumberNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NumberType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: number;
    errors: JSONError[];
};

export type BooleanType = 'boolean';
export type BooleanNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: BooleanType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    schema: JSONSchema;
    value?: boolean;
    errors: JSONError[];
};

export type NullType = 'null';
export type NullNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NullType;
    options: T;
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
export function isNode(node: any): node is Node {
    return NodeTypes.includes(node?.type);
}

export function isParentNode(node: Node | JSONError): node is ObjectNode | ArrayNode {
    return node.type === 'array' || node.type === 'object';
}

export function isValueNode(node: Node | JSONError): node is StringNode | NumberNode | NullNode | BooleanNode {
    return node.type === 'string' || node.type === 'number' || node.type === 'null' || node.type === 'boolean';
}

export { isJSONError } from 'json-schema-library';
