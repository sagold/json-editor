import { Draft, DraftConfig, JsonEditor, JSONError } from 'json-schema-library';
import { create } from './node/create';
import { json } from './node/json';
import { get } from './node/get';
import { errors } from './node/errors';
import { set } from './transform/set';
import { unlinkAll } from './transform/unlinkAll';
import { flat } from './node/flat';
import { remove as removeTarget } from './transform/remove';
import { move as moveItem } from './transform/move';
import { updateErrors } from './validate/updateErrors';
import { JSONSchema, Change, Node, ParentNode, ArrayNode, isJSONError } from './types';
import { splitLastProperty } from './splitLastProperty';
import { deepEqual } from 'fast-equals';

export interface PluginInstance {
    id: string;
    onEvent: PluginObserver;
    [p: string]: unknown;
}

export type Plugin = (he: HeadlessJsonEditor, options: HeadlessJsonEditorOptions) => PluginInstance | undefined;

export type DoneEvent = { type: 'done'; previous: Node; next: Node; changes: PluginEvent[] };
export type UndoEvent = { type: 'undo'; previous: Node; next: Node };
export type RedoEvent = { type: 'redo'; previous: Node; next: Node };
export type ValidationEvent = { type: 'validation'; previous: Node; next: Node; errors: JSONError[] };
export type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent | ValidationEvent;
export type PluginObserver = (root: Node, event: PluginEvent) => void | [Node, Change[]];

function getRootChange(changes: Change[]) {
    let lowestPointer: string = changes[0]?.node.pointer || '#';
    changes.forEach(({ node }) => {
        if (lowestPointer.includes(node.pointer)) {
            lowestPointer = node.pointer;
        }
    });
    return lowestPointer;
}

function runPlugins(plugins: PluginInstance[], oldState: Node, newState: Node, changes: PluginEvent[]) {
    // @notify change
    changes.forEach((change) => {
        plugins.forEach((p) => {
            const returnValue = p.onEvent(newState, change);
            if (returnValue) {
                newState = returnValue[0];
                changes.push(...returnValue[1]);
            }
        });
    });
    // @notify done
    const done: DoneEvent = { type: 'done', previous: oldState, next: newState, changes };
    plugins.forEach((p) => p.onEvent(newState, done));
    return newState;
}

export type HeadlessJsonEditorOptions = {
    schema: JSONSchema;
    data?: unknown;
    draftConfig?: Partial<DraftConfig>;
    plugins?: Plugin[];
    validate?: boolean;
    [p: string]: unknown;
};

// @todo test setSchema
// @todo difference between setValue and setData (root?)?
export class HeadlessJsonEditor {
    state: Node;
    draft: Draft;
    changes: Change[] = [];
    plugins: PluginInstance[] = [];
    options: HeadlessJsonEditorOptions;

    constructor(options: HeadlessJsonEditorOptions) {
        const { schema, data = {}, plugins = [], draftConfig } = options;
        this.options = options;
        this.draft = new JsonEditor(schema, draftConfig);
        this.state = create<ParentNode>(this.draft, this.draft.getTemplate(data));
        plugins.map((p) => this.addPlugin(p));
        setTimeout(() => options.validate && this.validate());
    }

    // import diff from 'microdiff';
    setData(data?: unknown): Node {
        const { draft } = this;
        const previousState = this.state;
        this.state = create<ParentNode>(draft, draft.getTemplate(data));
        this.options.validate === true && this.validate();
        const changes: Change[] = flat(this.state).map((node) => ({ type: 'create', node }));
        this.state = runPlugins(this.plugins, previousState, this.state, changes);
        return this.state;
    }

    setSchema(schema: JSONSchema) {
        this.draft.setSchema(schema);
        return this.setData(json(this.state));
    }

    validate() {
        if (this.state == null) {
            return;
        }
        const state = unlinkAll(this.state);
        updateErrors(this.draft, state);
        const validationErrors = errors(this.state);
        this.state = runPlugins(this.plugins, this.state, state, [
            { type: 'validation', previous: this.state, next: state, errors: validationErrors }
        ]);
    }

    setState(state: Node, changes: PluginEvent[]) {
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return this.state;
    }

    getState() {
        return this.state;
    }

    getNode<T extends Node = Node>(pointer?: string): T {
        if (pointer && typeof pointer === 'string' && pointer.replace(/^[/#]+/, '') !== '') {
            return get(this.state, pointer) as T;
        }
        return this.state as T;
    }

    plugin(pluginId: string) {
        return this.plugins.find((p) => p.id === pluginId);
    }

    addPlugin(plugin: Plugin) {
        const p = plugin(this, this.options);
        if (p && p.id) {
            this.plugins.push(p);
        }
    }

    setValue(pointer: string, value: unknown): Node {
        const previousNode = get(this.state, pointer);
        if (!isJSONError(previousNode)) {
            const previousValue = json(previousNode);
            if (deepEqual(previousValue, value)) {
                return this.state;
            }
        }

        const [state, changes] = set(this.draft, this.state, pointer, value);
        if (isJSONError(state)) {
            console.error(`error setting '${pointer}' = ${value}`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        updateErrors(this.draft, state, getRootChange(changes));
        // console.log('new state', state);
        this.changes.push(...changes);
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return this.state;
    }

    removeValue(pointer: string): Node {
        const [state, changes] = removeTarget(this.state, pointer);
        if (isJSONError(state)) {
            console.error(`error removing '${pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        const [parent] = splitLastProperty(pointer);
        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using remove
        updateErrors(this.draft, state, parent);
        this.changes.push(...changes);
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return this.state;
    }

    moveItem(pointer: string, to: number): Node {
        const [parent, from] = splitLastProperty(pointer);
        console.log('move', parent, from, to);
        const [state, changes] = moveItem(this.draft, this.state, parent, parseInt(from), to);
        console.log(changes, state);
        if (isJSONError(state)) {
            console.error(`error moving nodes in '${pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        updateErrors(this.draft, state, pointer);
        this.changes.push(...changes);
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return this.state;
    }

    appendItem(node: ArrayNode, itemSchema: JSONSchema): Node {
        const value = this.draft.getTemplate(null, itemSchema);
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = set(this.draft, this.state, pointer, value);
        if (isJSONError(state)) {
            console.error(`error apending item from schema '${node.pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        updateErrors(this.draft, state, node.pointer);
        let newState = runPlugins(this.plugins, this.state, state, changes);
        if (isJSONError(newState)) {
            console.error(`error from state returned by plugins '${node.pointer}'`);
            console.log(newState);
            newState = state;
        }
        this.state = newState;
        return this.state;
    }

    /**
     * @returns a list of available json subschemas to insert
     */
    getArrayAddOptions(node: ArrayNode) {
        const schema = this.draft.getSchema(node.pointer, json(this.state));
        return this.draft.getChildSchemaSelection(node.children.length, schema);
    }

    getTemplateData(schema: JSONSchema) {
        return this.draft.getTemplate(null, schema);
    }
}
