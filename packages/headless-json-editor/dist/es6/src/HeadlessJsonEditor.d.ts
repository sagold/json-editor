import { Draft, DraftConfig, JSONError } from 'json-schema-library';
import { JSONSchema, Change, Node, ArrayNode } from './types';
export interface PluginInstance {
    id: string;
    onEvent: PluginObserver;
    [p: string]: unknown;
}
export declare type Plugin = (he: HeadlessJsonEditor, options: HeadlessJsonEditorOptions) => PluginInstance | undefined;
export declare type DoneEvent = {
    type: 'done';
    previous: Node;
    next: Node;
    changes: PluginEvent[];
};
export declare type UndoEvent = {
    type: 'undo';
    previous: Node;
    next: Node;
};
export declare type RedoEvent = {
    type: 'redo';
    previous: Node;
    next: Node;
};
export declare type ValidationEvent = {
    type: 'validation';
    previous: Node;
    next: Node;
    errors: JSONError[];
};
export declare type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent | ValidationEvent;
export declare type PluginObserver = (root: Node, event: PluginEvent) => void | [Node, Change[]];
export declare type HeadlessJsonEditorOptions = {
    schema: JSONSchema;
    data?: unknown;
    draftConfig?: Partial<DraftConfig>;
    plugins?: Plugin[];
    validate?: boolean;
    [p: string]: unknown;
};
export declare class HeadlessJsonEditor {
    state: Node;
    draft: Draft;
    changes: Change[];
    plugins: PluginInstance[];
    options: HeadlessJsonEditorOptions;
    constructor(options: HeadlessJsonEditorOptions);
    setData(data?: unknown): Node;
    setSchema(schema: JSONSchema): Node;
    validate(): void;
    setState(state: Node, changes: PluginEvent[]): Node;
    getState(): Node;
    getNode<T extends Node = Node>(pointer?: string): T;
    plugin(pluginId: string): PluginInstance | undefined;
    addPlugin(plugin: Plugin): void;
    setValue(pointer: string, value: unknown): Node;
    removeValue(pointer: string): Node;
    moveItem(pointer: string, to: number): Node;
    appendItem(node: ArrayNode, itemSchema: JSONSchema): Node;
    /**
     * @returns a list of available json subschemas to insert
     */
    getArrayAddOptions(node: ArrayNode): JSONError | import("json-schema-library").JSONSchema[];
    getTemplateData(schema: JSONSchema): any;
}
