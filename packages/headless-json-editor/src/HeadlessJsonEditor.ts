import { Draft, JsonEditor } from 'json-schema-library';
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
import { JsonSchema, Change, Node, ParentNode, ArrayNode, isJsonError } from './types';
import { deepEqual } from 'fast-equals';
import gp from '@sagold/json-pointer';
import { Plugin, PluginConfig, PluginInstance, isPluginConfig, PluginEvent, DoneEvent, HeadlessJsonEditorInterface, HeadlessJsonEditorOptions, O } from "./plugins/Plugin";


function getRootChange(changes: Change[]) {
    if (changes.length === 0) {
        return '#';
    }

    let lowestPointer: string = changes[0]?.node.pointer || '#';
    changes.forEach(({ node }) => {
        if (lowestPointer.includes(node.pointer)) {
            lowestPointer = node.pointer;
        }
    });
    return lowestPointer;
}

function validateState(draft: Draft, root: Node, pointer = '#') {
    // always evaluate parent as it can be that children are referenced in parent
    let validationTarget = gp.join(pointer, '..');
    const startNode = get(root, validationTarget);
    if (startNode.type === 'error') {
        // if the node no longer exists, fallback to validate all
        validationTarget = '#';
    }
    updateErrors(draft, root, validationTarget);
}


// @todo test setSchema
// @todo difference between setValue and setData (root?)?
export class HeadlessJsonEditor<Data = unknown> implements HeadlessJsonEditorInterface<Data> {
    state: Node;
    draft: Draft;
    changes: Change[] = [];
    plugins: PluginInstance[] = [];
    options: HeadlessJsonEditorOptions<Data>;
    templateOptions = {
        addOptionalProps: false
    };

    constructor(options: HeadlessJsonEditorOptions<Data>) {
        const { schema, data = {}, plugins = [], draftConfig, addOptionalProps = false } = options;
        this.options = options;
        this.templateOptions.addOptionalProps = addOptionalProps;
        this.draft = new JsonEditor(schema, draftConfig);
        this.state = create<ParentNode>(
            this.draft,
            this.draft.getTemplate(data, this.draft.getSchema(), this.templateOptions)
        );
        plugins.forEach((p) => this.addPlugin(p));
        options.validate && this.validate();
    }

    get optionalProperties() {
        return this.templateOptions.addOptionalProps === false;
    }

    // import diff from 'microdiff';
    setData(data?: Data): Node {
        const { draft } = this;
        const previousState = this.state;
        this.state = create<ParentNode>(
            draft,
            draft.getTemplate(data, draft.getSchema(), {
                addOptionalProps: false
            })
        );
        this.options.validate === true && this.validate();
        const changes: Change[] = flat(this.state).map((node) => ({ type: 'create', node }));
        this.state = this.runPlugins(previousState, this.state, changes);
        return this.state;
    }

    /** get current json-data */
    getData() {
        return json(this.state) as Data;
    }

    /**
     * sets a new or modified json-schema and updates data and nodes
     */
    setSchema(schema: JsonSchema) {
        this.draft.setSchema(schema);
        return this.setData(json(this.state) as Data);
    }

    validate() {
        if (this.state == null) {
            return;
        }
        const state = unlinkAll(this.state);
        validateState(this.draft, state);
        const validationErrors = errors(this.state);
        this.state = this.runPlugins(this.state, state, [
            { type: 'validation', previous: this.state, next: state, errors: validationErrors }
        ]);
    }

    setState(state: Node, changes: PluginEvent[]) {
        this.state = this.runPlugins(this.state, state, changes);
        return this.state;
    }

    /**
     * return root node (duplicate to getNode)
     */
    getState() {
        return this.state;
    }

    /**
     * get current node at json-pointer location
     */
    getNode<T extends Node = Node>(pointer?: string) {
        if (pointer && typeof pointer === 'string' && pointer.replace(/^[/#]+/, '') !== '') {
            return get<T>(this.state, pointer);
        }
        return this.state as T;
    }

    plugin(pluginId: string) {
        return this.plugins.find((p) => p.id === pluginId);
    }

    addPlugin(plugin: Plugin | PluginConfig, options: Record<string, unknown> = {}) {
        let pluginConstructor: Plugin;
        let pluginOptions: O;
        if (isPluginConfig(plugin)) {
            pluginConstructor = plugin.plugin;
            pluginOptions = { ...this.options, ...plugin.options, ...options };
        } else {
            pluginConstructor = plugin;
            pluginOptions = { ...this.options, ...options };
        }

        const p = pluginConstructor(this, pluginOptions);
        if (p && p.id) {
            this.plugins.push(p);
            return p;
        }
        return undefined;
    }

    runPlugins(oldState: Node, newState: Node, changes: PluginEvent[]) {
        const plugins = this.plugins;
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
        this.state = newState;
        // @notify done
        const done: DoneEvent = { type: 'done', previous: oldState, next: newState, changes };
        plugins.forEach((p) => p.onEvent(newState, done));
        return newState;
    }

    /**
     * Returns the current json data
     * @param [pointer] - optional json-pointer of data to return. Returns whole json-data per default
     */
    getValue(pointer = '#') {
        return gp.get(json(this.state), pointer);
    }

    addValue(pointer: string) {
        const schema = this.draft.getSchema({ pointer, data: json(this.state) });
        const value = this.draft.getTemplate(undefined, schema, this.templateOptions);
        return this.setValue(pointer, value);
    }

    setValue(pointer: string, value: unknown) {
        const previousNode = get(this.state, pointer);
        if (!isJsonError(previousNode)) {
            const previousValue = json(previousNode);
            if (deepEqual(previousValue, value)) {
                return this.state;
            }
        }

        const [state, changes] = set(this.draft, this.state, pointer, value);
        if (isJsonError(state)) {
            console.error(`error setting '${pointer}' = ${JSON.stringify(value)}`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, getRootChange(changes));

        this.changes.push(...changes);
        this.state = this.runPlugins(this.state, state, changes);
        return this.state;
    }

    removeValue(pointer: string) {
        const [state, changes] = removeTarget(this.draft, this.state, pointer);
        if (isJsonError(state)) {
            console.error(`error removing '${pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        const [parent] = gp.splitLast(pointer);

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using remove
        validateState(this.draft, state, parent);
        this.changes.push(...changes);
        this.state = this.runPlugins(this.state, state, changes);
        return this.state;
    }

    moveItem(pointer: string, to: number) {
        const [parent, from] = gp.splitLast(pointer);
        // console.log('move', parent, from, to);
        const [state, changes] = moveItem(this.draft, this.state, parent, parseInt(`${from}`), to);
        if (isJsonError(state)) {
            console.error(`error moving nodes in '${pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, pointer);
        this.changes.push(...changes);
        this.state = this.runPlugins(this.state, state, changes);
        return this.state;
    }

    appendItem(node: ArrayNode, itemSchema: JsonSchema) {
        const value = this.draft.getTemplate(null, itemSchema, this.templateOptions);
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = set(this.draft, this.state, pointer, value);
        if (isJsonError(state)) {
            console.error(`error apending item from schema '${node.pointer}'`);
            console.log(state);
            return this.state;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, node.pointer);
        const oldState = this.state;
        let newState = state;
        this.state = newState;
        newState = this.runPlugins(oldState, newState, changes);
        if (isJsonError(newState)) {
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
        const schema = this.draft.getSchema({ pointer: node.pointer, data: json(this.state) });
        const selections = this.draft.getChildSchemaSelection(node.children.length, schema);
        if (isJsonError(selections)) {
            return [{ type: 'string' }];
        }
        return selections;
    }

    getTemplateData(schema: JsonSchema) {
        return this.draft.getTemplate(null, schema, this.templateOptions);
    }
}
