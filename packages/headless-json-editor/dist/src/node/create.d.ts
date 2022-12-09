import { Draft, JSONPointer } from 'json-schema-library';
import { Node, NodeType, JSONSchema } from '../types';
export declare type DefaultNodeOptions = {
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
declare type CreateNode = (draft: Draft, data: any, schema: JSONSchema, pointer: JSONPointer) => Node;
export declare function getOptions(schema: JSONSchema, property: string): DefaultNodeOptions;
export declare const NODES: Record<NodeType, CreateNode>;
export declare function create<T extends Node = Node>(draft: Draft, data: unknown, schema?: JSONSchema, pointer?: JSONPointer): T;
export {};
