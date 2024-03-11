import { JsonError } from 'json-schema-library';
import { JsonSchema } from './jsonSchema';
import { DefaultNodeOptions } from './node/create';

export { JsonSchema };

export type DoneEvent = { type: 'done'; previous: Node; next: Node; changes: PluginEvent[] };
export type UndoEvent = { type: 'undo'; previous: Node; next: Node };
export type RedoEvent = { type: 'redo'; previous: Node; next: Node };
export type ValidationEvent = { type: 'validation'; previous: Node; next: Node; errors: JsonError[] };
export type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent | ValidationEvent;

export type Node = ArrayNode | ObjectNode | StringNode | NumberNode | BooleanNode | NullNode;

export type Change = { type: 'update' | 'create' | 'delete'; node: Node };
export function isChange(event: Record<string, unknown>): event is Change {
    if (event && typeof event === "object" && typeof event.type === "string") {
        const type = event.type;
        return event.node != null && (type === "update" || type === "create" || type === "delete");
    }
    return false;
}

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
