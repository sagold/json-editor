import { Draft, DraftConfig, JsonEditor } from 'json-schema-library';
import { create } from './node/create';
import { json } from './node/json';
import { set } from './transform/set';
import { flat } from './node/flat';
import { remove as removeTarget } from './transform/remove';
import { move as moveItem } from './transform/move';
import { updateErrors } from './validate/updateErrors';
import { JSONSchema, Change, Node, ParentNode, ArrayNode, isJSONError } from './types';
import { splitLastProperty } from './splitLastProperty';

export interface Plugin {
    id: string;
    create(he: HeadlessJsonEditor): PluginObserver | false;
    [p: string]: unknown;
}
export type DoneEvent = { type: 'done'; previous: Node; next: Node; changes: PluginEvent[] };
export type UndoEvent = { type: 'undo'; previous: Node; next: Node };
export type RedoEvent = { type: 'redo'; previous: Node; next: Node };
export type PluginEvent = Change | DoneEvent | UndoEvent | RedoEvent;
export type PluginObserver = (root: Node, event: PluginEvent) => void | [Node, Change[]];

function isPluginObserver(p: unknown): p is PluginObserver {
    return typeof p === 'function';
}

function getRootChange(changes: Change[]) {
    let lowestPointer: string = changes[0]?.node.pointer || '#';
    changes.forEach(({ node }) => {
        if (lowestPointer.includes(node.pointer)) {
            lowestPointer = node.pointer;
        }
    });
    return lowestPointer;
}

function runPlugins(plugins: PluginObserver[], oldState: Node, newState: Node, changes: PluginEvent[]) {
    // @notify change
    changes.forEach((change) => {
        plugins.forEach((p) => {
            const returnValue = p(newState, change);
            if (returnValue) {
                newState = returnValue[0];
                changes.push(...returnValue[1]);
            }
        });
    });
    // @notify done
    const done: DoneEvent = { type: 'done', previous: oldState, next: newState, changes };
    plugins.forEach((p) => p(newState, done));
    return newState;
}

export type HeadlessJsonEditorOptions = {
    schema: JSONSchema;
    data?: unknown;
    draftConfig?: Partial<DraftConfig>;
    plugins?: Plugin[];
};

export class HeadlessJsonEditor {
    state: Node;
    draft: Draft;
    changes: Change[] = [];
    plugins: PluginObserver[] = [];

    constructor({ schema, data = {}, plugins = [], draftConfig }: HeadlessJsonEditorOptions) {
        this.draft = new JsonEditor(schema, draftConfig);
        plugins.map((p) => this.addPlugin(p));
        this.state = create<ParentNode>(this.draft, this.draft.getTemplate(data));
        this.validate();
    }

    create(data?: unknown): Node {
        const { draft } = this;
        const state = create<ParentNode>(draft, draft.getTemplate(data));
        this.validate();
        const changes: Change[] = flat(state).map((node) => ({ type: 'create', node }));
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return state;
    }

    validate() {
        this.state && updateErrors(this.draft, this.state);
    }

    setState(state: Node, changes: PluginEvent[]) {
        this.state = runPlugins(this.plugins, this.state, state, changes);
        return this.state;
    }

    getState() {
        return this.state;
    }

    addPlugin(plugin: Plugin) {
        const p = plugin.create(this);
        if (isPluginObserver(p)) {
            this.plugins.push(p);
        }
    }

    setValue(pointer: string, value: unknown): Node {
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
        const [state, changes] = moveItem(this.draft, this.state, parent, parseInt(from), to);
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
