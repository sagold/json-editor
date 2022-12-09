import { JSONError } from 'json-schema-library';
import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import { DefaultNodeOptions } from './node/create';
export declare type JSONSchemaOptions = Record<string, unknown>;
declare type JSONSchemaDefinition = JSONSchema7Definition & JSONSchemaOptions;
export declare type JSONSchema = (JSONSchema7 & {
    isActive?: boolean;
    isDynamic?: boolean;
    oneOfSchema?: JSONSchema;
    options?: JSONSchemaOptions;
    properties?: {
        [key: string]: JSONSchemaDefinition;
    };
    patternProperties?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;
    additionalProperties?: JSONSchemaDefinition | undefined;
    dependencies?: {
        [key: string]: JSONSchemaDefinition | string[];
    } | undefined;
    definitions?: {
        [key: string]: JSONSchemaDefinition;
    } | undefined;
    allOf?: JSONSchemaDefinition[] | undefined;
    anyOf?: JSONSchemaDefinition[] | undefined;
    oneOf?: JSONSchemaDefinition[] | undefined;
    not?: JSONSchemaDefinition | undefined;
    items?: JSONSchemaDefinition | JSONSchemaDefinition[] | undefined;
    additionalItems?: JSONSchemaDefinition | undefined;
});
export declare type Node = ArrayNode | ObjectNode | StringNode | NumberNode | BooleanNode | NullNode;
export declare type Change = {
    type: 'update' | 'create' | 'delete';
    node: Node;
};
/** node type refers to the actual data value - it is not the expected schema type */
export declare type NodeType = ArrayType | ObjectType | StringType | NumberType | BooleanType | NullType;
export declare type ArrayType = 'array';
export declare type ArrayNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ArrayType;
    children: Node[];
    options: T;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};
export declare type ObjectType = 'object';
export declare type ObjectNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ObjectType;
    children: Node[];
    options: T;
    pointer: string;
    property: string;
    schema: JSONSchema;
    errors: JSONError[];
};
export declare type StringType = 'string';
export declare type StringNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
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
export declare type NumberType = 'number';
export declare type NumberNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
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
export declare type BooleanType = 'boolean';
export declare type BooleanNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
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
export declare type NullType = 'null';
export declare type NullNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
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
export declare type ParentNode<T extends DefaultNodeOptions = DefaultNodeOptions> = ArrayNode<T> | ObjectNode<T>;
export declare type ValueNode<T extends DefaultNodeOptions = DefaultNodeOptions> = StringNode<T> | NumberNode<T> | NullNode<T> | BooleanNode<T>;
export declare function isNode(node: any): node is Node;
export declare function isParentNode(node: Node | JSONError): node is ObjectNode | ArrayNode;
export declare function isValueNode(node: Node | JSONError): node is StringNode | NumberNode | NullNode | BooleanNode;
export { isJSONError } from 'json-schema-library';
