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
     *
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
    setState(state: Node, changes: PluginEvent[]): Node;
    getState(): Node;
    getValue(pointer?: string): unknown;
    setValue(pointer: string, value: unknown): Node;
    appendItem(node: ArrayNode, itemSchema: JsonSchema): Node;
    removeValue(pointer: string): Node;
    moveItem(pointer: string, to: number): Node;
    getArrayAddOptions(node: ArrayNode): JsonSchema[];
    getTemplateData(schema: JsonSchema): Data;
    plugin(pluginId: string): PluginInstance | undefined;
    addPlugin(plugin: Plugin | PluginConfig, options?: O): PluginInstance | undefined;
    runPlugins(oldState: Node, newState: Node, changes: PluginEvent[]): Node;
    validate(): void;
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

