import { JsonError } from 'json-schema-library';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { DefaultNodeOptions } from './node/create';

export type JsonSchemaOptions = Record<string, unknown>;
type JsonSchemaDefinition = JSONSchema7Definition & JsonSchemaOptions;

export type JsonSchema =
    | JSONSchema7 & {
          isActive?: boolean;
          isDynamic?: boolean;
          getOneOfOrigin?: () => {
              index: number;
              schema: JsonSchema;
              isItem?: boolean;
          };
          options?: JsonSchemaOptions;
          properties?: { [key: string]: JsonSchemaDefinition };
          patternProperties?: { [key: string]: JsonSchemaDefinition } | undefined;
          additionalProperties?: JsonSchemaDefinition | undefined;
          dependencies?: { [key: string]: JsonSchemaDefinition | string[] } | undefined;
          definitions?: { [key: string]: JsonSchemaDefinition } | undefined;
          allOf?: JsonSchemaDefinition[] | undefined;
          anyOf?: JsonSchemaDefinition[] | undefined;
          oneOf?: JsonSchemaDefinition[] | undefined;
          not?: JsonSchemaDefinition | undefined;
          items?: JsonSchemaDefinition | JsonSchemaDefinition[] | undefined;
          additionalItems?: JsonSchemaDefinition | undefined;
      };

export type Node = ArrayNode | ObjectNode | StringNode | NumberNode | BooleanNode | NullNode;

export type Change = { type: 'update' | 'create' | 'delete'; node: Node };

/** node type refers to the actual data value - it is not the expected schema type */
export type NodeType = ArrayType | ObjectType | StringType | NumberType | BooleanType | NullType;

export type ArrayType = 'array';
export type ArrayNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ArrayType;
    children: Node[];
    options: T;
    pointer: string;
    property: string;
    /** true, if this array is an array item */
    isArrayItem: boolean;
    /** final, reduced json-schema ob this array */
    schema: JsonSchema;
    /** list of validation errors on this array */
    errors: JsonError[];
    /** interaction state **/
    // actions: {
    //     canAddItem: boolean;
    //     canRemoveItem: boolean;
    // };
};

export type ObjectType = 'object';

export type ObjectNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ObjectType;
    children: Node[];
    options: T;
    /** list of all optional properties, present or missing */
    optionalProperties: string[];
    /** list of all missing optional properties */
    missingProperties: string[];
    pointer: string;
    property: string;
    /** true, if this object is an array item */
    isArrayItem: boolean;
    /** final, reduced json-schema ob this object */
    schema: JsonSchema;
    /** original json-schema at this location */
    sourceSchema: JsonSchema;
    /** list of validation errors on this object */
    errors: JsonError[];
};

export type StringType = 'string';
export type StringNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: StringType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    schema: JsonSchema;
    value?: string;
    errors: JsonError[];
};

export type NumberType = 'number';
export type NumberNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NumberType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    schema: JsonSchema;
    value?: number;
    errors: JsonError[];
};

export type BooleanType = 'boolean';
export type BooleanNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: BooleanType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    schema: JsonSchema;
    value?: boolean;
    errors: JsonError[];
};

export type NullType = 'null';
export type NullNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NullType;
    options: T;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    schema: JsonSchema;
    value?: null;
    errors: JsonError[];
};

export type ParentNode<T extends DefaultNodeOptions = DefaultNodeOptions> = ArrayNode<T> | ObjectNode<T>;
export type ValueNode<T extends DefaultNodeOptions = DefaultNodeOptions> =
    | StringNode<T>
    | NumberNode<T>
    | NullNode<T>
    | BooleanNode<T>;

const NodeTypes = ['array', 'object', 'string', 'number', 'null', 'boolean'] as const;
export function isNode(node: any): node is Node {
    return NodeTypes.includes(node?.type);
}

export function isParentNode(node: Node | JsonError): node is ObjectNode | ArrayNode {
    return node.type === 'array' || node.type === 'object';
}

export function isValueNode(node: Node | JsonError): node is StringNode | NumberNode | NullNode | BooleanNode {
    return node.type === 'string' || node.type === 'number' || node.type === 'null' || node.type === 'boolean';
}

export { isJsonError } from 'json-schema-library';
