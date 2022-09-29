import { Draft, JsonEditor, JSONSchema } from 'json-schema-library';
import { create } from './node/create';
import { json } from './node/json';
import { set } from './transform/set';
import { flat } from './node/flat';
import { remove as removeTarget } from './transform/remove';
import { move as moveItem } from './transform/move';
import { validate } from './validate/validate';
import { Change, Node, ParentNode, ArrayNode, isJSONError } from './node/types';
import { splitLastProperty } from './splitLastProperty';

export interface Plugin {
    create(jst: HeadlessJsonEditor): PluginObserver | false;
}
export type DoneEvent = { type: 'done'; previous: ParentNode; next: ParentNode };
export type PluginEvent = Change | DoneEvent;
export type PluginObserver = (root: Node, change: PluginEvent) => void | [Node, Change[]];

function isPluginObserver(p): p is PluginObserver {
    return typeof p === 'function';
}

export class HeadlessJsonEditor {
    state: ParentNode;
    draft: Draft;
    changes: Change[] = [];
    plugins: PluginObserver[];

    constructor({ schema, data = {}, plugins = [] }: { schema: JSONSchema; data?: unknown; plugins?: Plugin[] }) {
        this.draft = new JsonEditor(schema);
        this.plugins = plugins.map((p) => p.create(this)).filter(isPluginObserver);
        this.state = create<ParentNode>(this.draft, this.draft.getTemplate(data));
    }

    create(data?: unknown) {
        const { draft } = this;
        const state = create<ParentNode>(draft, draft.getTemplate(data));
        validate(draft, state);
        const changes: Change[] = flat(state).map((node) => ({ type: 'create', node }));
        this.state = this.runPlugins(state, changes);
        return state;
    }

    getState() {
        return this.state;
    }

    setValue(pointer: string, value: unknown) {
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
        validate(this.draft, state, pointer);
        // console.log('new state', state);
        this.changes.push(...changes);
        this.state = this.runPlugins(state, changes);
        return this.state;
    }

    remove(pointer: string) {
        const [state, changes] = removeTarget(this.state, pointer);
        if (isJSONError(state)) {
            console.error(`error removing '${pointer}'`);
            console.log(state);
            return state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        const [parent] = splitLastProperty(pointer);
        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using remove
        validate(this.draft, state, parent);
        this.changes.push(...changes);
        this.state = this.runPlugins(state as ParentNode, changes);
        return this.state;
    }

    moveItem(pointer: string, to: number) {
        const [parent, from] = splitLastProperty(pointer);
        const [state, changes] = moveItem(this.draft, this.state, parent, parseInt(from), to);
        if (isJSONError(state)) {
            console.error(`error moving nodes in '${pointer}'`);
            console.log(state);
            return state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validate(this.draft, state, pointer);
        this.changes.push(...changes);
        this.state = this.runPlugins(state as ParentNode, changes);
        return this.state;
    }

    appendItem(node: ArrayNode, itemSchema: JSONSchema): ParentNode {
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
        validate(this.draft, state, node.pointer);
        let newState = this.runPlugins(state, changes);
        if (isJSONError(newState)) {
            console.error(`error from state returned by plugins '${node.pointer}'`);
            console.log(newState);
            newState = state;
        }
        this.state = newState;
        return this.state;
    }

    runPlugins(state: ParentNode, changes: Change[]) {
        // @notify change
        changes.forEach((change) => {
            this.plugins.forEach((p) => {
                const returnValue = p(state, change);
                if (returnValue) {
                    state = returnValue[0] as ParentNode;
                    changes.push(...returnValue[1]);
                }
            });
        });
        // @notify done
        const done: DoneEvent = { type: 'done', previous: this.state, next: state };
        this.plugins.forEach((p) => p(state, done));
        return state;
    }

    getArrayAddOptions(node: ArrayNode) {
        const schema = this.draft.getSchema(node.pointer, json(this.state));
        return this.draft.getChildSchemaSelection(node.children.length, schema);
    }

    getTemplateData(schema: JSONSchema) {
        return this.draft.getTemplate(null, schema);
    }
}
