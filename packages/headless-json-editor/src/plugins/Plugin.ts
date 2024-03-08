import { Node, Change, ArrayNode } from "../types";
import { Draft, DraftConfig, JsonSchema, JsonError } from 'json-schema-library';

export type O = Record<string, unknown>;

export type HeadlessJsonEditorOptions<Data = unknown> = {
    schema: JsonSchema;
    data?: Data;
    draftConfig?: Partial<DraftConfig>;
    plugins?: (Plugin | PluginConfig)[];
    /** if data should be initially validated */
    validate?: boolean;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    [p: string]: unknown;
} & O;

export interface HeadlessJsonEditorInterface<Data = unknown> {
    state: Node;
    draft: Draft;
    options: HeadlessJsonEditorOptions<Data>;
    /**
     * Set data
     * @return new root node
     */
    setData(data?: Data): Node;
    /**
     * Get current json-data
     * @return
     */
    getData(): Data;
    /**
     * Get current node at json-pointer location
     */
    getNode<T extends Node = Node>(pointer?: string): T | JsonError;
    /**
     * Set a new or modified json-schema and updates data and nodes
     * @return new root node
     */
    setSchema(schema: JsonSchema): Node;
    /**
     * Set new editor state (new tree of nodes)
     * @return new root node
     */
    setState(state: Node, changes: PluginEvent[]): Node;
    /**
     * Return root node (duplicate to getNode)
     * @return current root node
     */
    getState(): Node;
    /**
     * Returns the current json data
     * @param [pointer] - optional json-pointer of data to return. Returns whole json-data per default
     */
    getValue(pointer?: string): unknown;
    /**
     * Set value for given data-location
     * @param pointer - json-pointer in data of target value
     * @param value - value to set at location
     * @return new root node or current one if nothing changed
     */
    setValue(pointer: string, value: unknown): Node;
    /**
     * Shortcut to add a value at a given location. This usually is used to add array-items
     * @return new root node
     */
    addValue(pointer: string): Node;
    /**
     * Append an item defined by a json-schema to the target array
     */
    appendItem(node: ArrayNode, itemSchema: JsonSchema): Node;
    /**
     * Delete the value at the given json-pointer location
     * @return new root node
     */
    removeValue(pointer: string): Node;
    /**
     * Move the referenced array-item to another array position
     */
    moveItem(pointer: string, to: number): Node;
    /**
     * @return a list of available json subschemas to insert
     */
    getArrayAddOptions(node: ArrayNode): JsonSchema[];
    /**
     * Get a plugin by pluginId
     */
    plugin(pluginId: string): PluginInstance | undefined;
    addPlugin(plugin: Plugin | PluginConfig, options?: O): PluginInstance | undefined;
    runPlugins(oldState: Node, newState: Node, changes: PluginEvent[]): Node;
    /**
     * Perform data validation and update nodes
     * @return validation errors
     */
    validate(): JsonError[];
    /**
     * Get current validation errors of node-tree
     * @return validation errors of state
     */
    getErrors(): JsonError[];
    /**
     * Shortcut to return default data based on json-schema only
     * @return default data confirming to json-schema
     */
    getTemplateData(schema: JsonSchema): Data;
}

export type PluginInstance<Signature extends O = O> = {
    id: string;
    onEvent: PluginObserver;
} & Signature;

export type Plugin<Options extends O = O, Signature extends O = O, Editor extends HeadlessJsonEditorInterface =
    HeadlessJsonEditorInterface> = (he: Editor, options: Options) => PluginInstance<Signature> | undefined;

export type PluginConfig<Options extends O = O, Signature extends O = O> = {
    plugin: Plugin<Options, Signature>;
    options: Options
};

export type DoneEvent = { type: 'done'; previous: Node; next: Node; changes: PluginEvent[] };
export type UndoEvent = { type: 'undo'; previous: Node; next: Node };
export type RedoEvent = { type: 'redo'; previous: Node; next: Node };
export type ValidationEvent = { type: 'validation'; previous: Node; next: Node; errors: JsonError[] };
export type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent | ValidationEvent;
export type PluginObserver = (root: Node, event: PluginEvent) => void | [Node, Change[]];

export function isPluginConfig(plugin: Plugin | PluginConfig): plugin is PluginConfig {
    return plugin && typeof plugin === "object" && typeof plugin.plugin === "function";
}

