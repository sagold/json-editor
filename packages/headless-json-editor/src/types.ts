import { JsonError, SchemaNode, getTypeOf } from 'json-schema-library';
import type { JsonSchema } from './jsonSchema';
import { DefaultNodeOptions } from './node/createNode';

export type { JsonSchema, JsonError };

const isObject = (v: unknown): v is Record<string, any> => getTypeOf(v) === 'object';

export type DoneEvent = { type: 'done'; previous: Node; next: Node; changes: PluginEvent[] };
export type UndoEvent = { type: 'undo'; previous: Node; next: Node };
export type RedoEvent = { type: 'redo'; previous: Node; next: Node };
export type ValidationEvent = { type: 'validation'; previous: Node; next: Node; errors: JsonError[] };
export type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent | ValidationEvent;

export type Node = ArrayNode | ObjectNode | FileNode | StringNode | NumberNode | BooleanNode | NullNode;

export type Change = { type: 'update' | 'create' | 'delete'; node: Node };
export function isChangeEvent(event: Record<string, unknown>): event is Change {
    if (event && typeof event === 'object' && typeof event.type === 'string') {
        const type = event.type;
        return event.node != null && (type === 'update' || type === 'create' || type === 'delete');
    }
    return false;
}

/** node type refers to the actual data value - it is not the expected schema type */
export type NodeType = ArrayType | ObjectType | FileType | StringType | NumberType | BooleanType | NullType;

export type ArrayType = 'array';
export type ArrayNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ArrayType;
    children: Node[];
    oneOfIndex?: number;
    options: T;
    pointer: string;
    property: string;
    /** true, if this array is an array item */
    isArrayItem: boolean;
    /** final, reduced JSON Schema ob this array */
    schema: JsonSchema;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    /** list of validation errors on this array */
    errors: JsonError[];
};

export type ObjectType = 'object';
export type ObjectNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: ObjectType;
    children: Node[];
    options: T;
    oneOfIndex?: number;
    /** list of all optional properties, present or missing */
    optionalProperties: string[];
    /** list of all missing optional properties */
    missingProperties: string[];
    pointer: string;
    property: string;
    /** true, if this object is an array item */
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this object */
    schema: JsonSchema;
    /** unreduced (original) schemaNode for this schema */
    schemaNode: SchemaNode;
    /** list of validation errors on this object */
    errors: JsonError[];
};

export type StringType = 'string';
export type StringNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: StringType;
    options: T;
    oneOfIndex?: number;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this node */
    schema: JsonSchema;
    value?: string;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    errors: JsonError[];
};

export type FileType = 'file';
export type FileNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: FileType;
    options: T;
    oneOfIndex?: number;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this node */
    schema: JsonSchema;
    value?: File;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    errors: JsonError[];
};

export type NumberType = 'number';
export type NumberNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NumberType;
    options: T;
    oneOfIndex?: number;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this node */
    schema: JsonSchema;
    value?: number;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    errors: JsonError[];
};

export type BooleanType = 'boolean';
export type BooleanNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: BooleanType;
    options: T;
    oneOfIndex?: number;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this node */
    schema: JsonSchema;
    value?: boolean;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    errors: JsonError[];
};

export type NullType = 'null';
export type NullNode<T extends DefaultNodeOptions = DefaultNodeOptions> = {
    id: string;
    type: NullType;
    options: T;
    oneOfIndex?: number;
    pointer: string;
    /** do we store parent property here or on parent node? */
    property: string;
    isArrayItem: boolean;
    /** final, reduced JSON Schema of this node */
    schema: JsonSchema;
    value?: null;
    /** unreduced schemaNode for this schema */
    schemaNode: SchemaNode;
    errors: JsonError[];
};

export type ParentNode<T extends DefaultNodeOptions = DefaultNodeOptions> = ArrayNode<T> | ObjectNode<T>;
export type ValueNode<T extends DefaultNodeOptions = DefaultNodeOptions> =
    | StringNode<T>
    | NumberNode<T>
    | NullNode<T>
    | BooleanNode<T>;

const NodeTypes = ['array', 'object', 'file', 'string', 'number', 'null', 'boolean'] as const;
export const isNode = (node: any): node is Node => NodeTypes.includes(node?.type);
const ParentTypes = ['array', 'object'];
export const isParentNode = (node: unknown): node is ObjectNode | ArrayNode =>
    isObject(node) && ParentTypes.includes(node.type);
export const isFileNode = (node: unknown): node is FileNode => isObject(node) && node.type === 'file';
const ValueTypes = ['string', 'number', 'null', 'boolean'];
export const isValueNode = (node: unknown): node is StringNode | NumberNode | NullNode | BooleanNode =>
    isObject(node) && ValueTypes.includes(node.type);
export const isArrayNode = (node: unknown): node is ArrayNode => isObject(node) && node.type === 'array';
export const isObjectNode = (node: unknown): node is ObjectNode => isObject(node) && node.type === 'object';
export const isNumberNode = (node: unknown): node is NumberNode => isObject(node) && node.type === 'number';
export const isStringNode = (node: unknown): node is StringNode => isObject(node) && node.type === 'string';
export const isBooleanNode = (node: unknown): node is BooleanNode => isObject(node) && node.type === 'boolean';
export const isNullNode = (node: unknown): node is NullNode => isObject(node) && node.type === 'null';

export { isJsonError } from 'json-schema-library';
