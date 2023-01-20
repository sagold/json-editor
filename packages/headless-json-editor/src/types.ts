import { JSONError } from 'json-schema-library';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { DefaultNodeOptions } from './node/create';

export type JSONSchemaOptions = Record<string, unknown>;
type JSONSchemaDefinition = JSONSchema7Definition & JSONSchemaOptions;

export type JSONSchema =
    | JSONSchema7 & {
          isActive?: boolean;
          isDynamic?: boolean;
          getOneOfOrigin?: () => {
              index: number;
              schema: JSONSchema;
              isItem?: boolean;
          };
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
    schema: JSONSchema;
    /** list of validation errors on this array */
    errors: JSONError[];
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
    schema: JSONSchema;
    /** original json-schema at this location */
    sourceSchema: JSONSchema;
    /** list of validation errors on this object */
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
    isArrayItem: boolean;
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
    isArrayItem: boolean;
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
    isArrayItem: boolean;
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
    isArrayItem: boolean;
    schema: JSONSchema;
    value?: null;
    errors: JSONError[];
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

export function isParentNode(node: Node | JSONError): node is ObjectNode | ArrayNode {
    return node.type === 'array' || node.type === 'object';
}

export function isValueNode(node: Node | JSONError): node is StringNode | NumberNode | NullNode | BooleanNode {
    return node.type === 'string' || node.type === 'number' || node.type === 'null' || node.type === 'boolean';
}

export { isJSONError } from 'json-schema-library';
