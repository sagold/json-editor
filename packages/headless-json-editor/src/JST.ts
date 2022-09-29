import { Interface as Core, JsonEditor, JSONSchema, getChildSchemaSelection } from 'json-schema-library';
import { create } from './node/create';
import { json } from './node/json';
import { set } from './transform/set';
import { flat } from './node/flat';
import { remove as removeTarget } from './transform/remove';
import { move as moveItem } from './transform/move';
import { validate } from './validate/validate';
import { Change, Node, ParentNode, ArrayNode, isJsonError } from './node/types';
import { splitLastProperty } from './splitLastProperty';

export interface Plugin {
    create(jst: JST): PluginObserver | false;
}
export type DoneEvent = { type: 'done'; previous: ParentNode; next: ParentNode };
export type PluginEvent = Change | DoneEvent;
export type PluginObserver = (root: Node, change: PluginEvent) => void | [Node, Change[]];

function isPluginObserver(p): p is PluginObserver {
    return typeof p === 'function';
}

export class JST {
    state: ParentNode;
    core: Core;
    changes: Change[] = [];
    plugins: PluginObserver[];

    constructor({ schema, plugins = [] }: { schema: JSONSchema; plugins: Plugin[] }) {
        this.core = new JsonEditor(schema);
        this.plugins = plugins.map((p) => p.create(this)).filter(isPluginObserver);
        this.state = create<ParentNode>(this.core, this.core.getTemplate({}));
    }

    create(data?: any) {
        const { core } = this;
        const state = create<ParentNode>(core, core.getTemplate(data));
        validate(core, state);
        const changes: Change[] = flat(state).map((node) => ({ type: 'create', node }));
        this.state = this.runPlugins(state, changes);
        return state;
    }

    setValue(pointer: string, value: unknown) {
        const [state, changes] = set(this.core, this.state, pointer, value);
        if (isJsonError(state)) {
            console.error(`error setting '${pointer}' = ${value}`);
            console.log(state);
            return state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validate(this.core, state, pointer);
        // console.log('new state', state);
        this.changes.push(...changes);
        this.state = this.runPlugins(state, changes);
        console.log('JST set done', this.state);
        return this.state;
    }

    remove(pointer: string) {
        const [state, changes] = removeTarget(this.state, pointer);
        if (isJsonError(state)) {
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
        validate(this.core, state, parent);
        this.changes.push(...changes);
        this.state = this.runPlugins(state as ParentNode, changes);
        return this.state;
    }

    moveItem(pointer: string, to: number) {
        const [parent, from] = splitLastProperty(pointer);
        const [state, changes] = moveItem(this.core, this.state, parent, parseInt(from), to);
        if (isJsonError(state)) {
            console.error(`error moving nodes in '${pointer}'`);
            console.log(state);
            return state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validate(this.core, state, pointer);
        this.changes.push(...changes);
        this.state = this.runPlugins(state as ParentNode, changes);
        return this.state;
    }

    appendItem(node: ArrayNode, itemSchema: JSONSchema) {
        const value = this.core.getTemplate(null, itemSchema);
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = set(this.core, this.state, pointer, value);
        if (isJsonError(state)) {
            console.error(`error apending item from schema '${node.pointer}'`);
            console.log(state);
            return state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validate(this.core, state, node.pointer);
        this.state = this.runPlugins(state, changes);
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
        const schema = this.core.getSchema(node.pointer, json(this.state));
        return getChildSchemaSelection(this.core, node.children.length, schema);
    }

    getTemplateData(schema: JSONSchema) {
        return this.core.getTemplate(null, schema);
    }
}
