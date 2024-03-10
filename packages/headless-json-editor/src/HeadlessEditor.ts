import gp from '@sagold/json-pointer';
import { create } from './node/create';
import { deepEqual } from 'fast-equals';
import { Draft, DraftConfig, JsonEditor } from 'json-schema-library';
import { errors } from './node/errors';
import { flat } from './node/flat';
import { get } from './node/get';
import { json } from './node/json';
import { JsonSchema, Change, Node, ParentNode, ArrayNode, isJsonError, PluginEvent, DoneEvent, ValidationEvent } from './types';
import { move as moveItem } from './transform/move';
import { remove as removeTarget } from './transform/remove';
import { set } from './transform/set';
import { unlinkAll } from './transform/unlinkAll';
import { updateErrors } from './validate/updateErrors';

export type O = Record<string, unknown>;

export type PluginInstance<Signature extends O = O> = {
    id: string;
    /** Called for all events, e.g. `create`, `update`, `delete`, `undo`, etc.
     *  Each event loop is finished by a done-event, which contains a list of modified nodes
     *
     *  `onEvent` may return a new root-node along with a list of changes
     */
    onEvent: (root: Node, event: PluginEvent) => void | [Node, Change[]];
} & Signature;

export type Plugin<
    Options extends O = O,
    Signature extends O = O,
    Editor extends HeadlessEditor = HeadlessEditor
> = (he: Editor, options: Options) => PluginInstance<Signature> | undefined;

export type HeadlessEditorOptions<Data = unknown> = {
    schema: JsonSchema;
    data?: Data;
    draftConfig?: Partial<DraftConfig>;
    plugins?: Plugin[];
    /** if data should be initially validated */
    validate?: boolean;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    [p: string]: unknown;
} & O;


// @todo test setSchema
// @todo difference between setValue and setData (root?)?
export class HeadlessEditor<Data = unknown> {
    /** Editor root node */
    root: Node;
    /** Json-Schema API */
    draft: Draft;
    /** @deprecated list of all changes - probably unused */
    changes: Change[] = [];
    /** list of active plugins */
    plugins: PluginInstance[] = [];
    /** input options for this editor instance */
    options: HeadlessEditorOptions<Data>;
    templateOptions = {
        addOptionalProps: false
    };

    constructor(options: HeadlessEditorOptions<Data>) {
        const { schema, data = {}, plugins = [], draftConfig, addOptionalProps = false } = options;
        this.options = options;
        this.templateOptions.addOptionalProps = addOptionalProps;
        this.draft = new JsonEditor(schema, draftConfig);
        this.root = create<ParentNode>(
            this.draft,
            this.draft.getTemplate(data, this.draft.getSchema(), this.templateOptions)
        );
        plugins.forEach((p) => this.addPlugin(p));
        options.validate && this.validate();
    }

    get optionalProperties() {
        return this.templateOptions.addOptionalProps === false;
    }

    /**
     * Returns the current json data
     * @param [pointer] - optional json-pointer of data to return. Returns whole json-data per default
     */
    getData(pointer = '#') {
        return gp.get(json(this.root), pointer);
    }

    /**
     * Set new data and rebuild node tree
     * @return new root node
     */
    setData(data?: Data): Node {
        const { draft } = this;
        const previousState = this.root;
        this.root = create<ParentNode>(
            draft,
            draft.getTemplate(data, draft.getSchema(), {
                addOptionalProps: false
            })
        );
        this.options.validate === true && this.validate();
        const changes: Change[] = flat(this.root).map((node) => ({ type: 'create', node }));
        this.root = this.runPlugins(previousState, this.root, changes);
        return this.root;
    }

    /**
     * Shortcut to return default data based on json-schema only
     * @return default data confirming to json-schema
     */
    getTemplateData(schema: JsonSchema) {
        return this.draft.getTemplate(null, schema, this.templateOptions);
    }

    /**
     * @return current json-schema
     */
    getSchema() {
        return this.draft.getSchema();
    }

    /**
     * sets a new or modified json-schema and updates data and nodes
     */
    setSchema(schema: JsonSchema) {
        this.draft.setSchema(schema);
        return this.setData(json(this.root) as Data);
    }

    /**
     * Perform data validation and update nodes
     * @return list of validation errors
     */
    validate() {
        if (this.root == null) {
            return [];
        }
        const state = unlinkAll(this.root);
        validateState(this.draft, state);
        const validationErrors = errors(this.root);
        const event: ValidationEvent = { type: 'validation', previous: this.root, next: state, errors: validationErrors };
        this.root = this.runPlugins(this.root, state, [event]);
        return validationErrors;
    }

    /**
     * Get current validation errors of node-tree
     * @return validation errors of state
     */
    getErrors() {
        return this.root ? errors(this.root) : [];
    }

    /**
     * Set new editor state (new tree of nodes)
     * @return new root node
     */
    setState(state: Node, changes: PluginEvent[]) {
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Get current node at json-pointer location. Returns root node per default
     * @return node at given location (default root node) or json-error
     */
    getNode(): Node;
    getNode(pointer?: string) {
        if (pointer && typeof pointer === 'string' && pointer.replace(/^[/#]+/, '') !== '') {
            return get(this.root, pointer);
        }
        return this.root;
    }

    /**
     * Get a plugin by pluginId
     */
    findPlugin(pluginId: string) {
        return this.plugins.find((p) => p.id === pluginId);
    }

    addPlugin(plugin: Plugin, pluginOptions: Record<string, unknown> = {}) {
        const p = plugin(this, pluginOptions);
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
        this.root = newState;
        // @notify done
        const done: DoneEvent = { type: 'done', previous: oldState, next: newState, changes };
        plugins.forEach((p) => p.onEvent(newState, done));
        return newState;
    }

    /**
     * Set value at given data-location
     * @param pointer - json-pointer in data of target value
     * @param value - value to set at location
     * @return new root node or current one if nothing changed
     */
    setValue(pointer: string, value: unknown) {
        const previousNode = get(this.root, pointer);
        if (!isJsonError(previousNode)) {
            const previousValue = json(previousNode);
            if (deepEqual(previousValue, value)) {
                return this.root;
            }
        }

        const [state, changes] = set(this.draft, this.root, pointer, value);
        if (isJsonError(state)) {
            console.error(`error setting '${pointer}' = ${JSON.stringify(value)}`);
            console.log(state);
            return this.root;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, getRootChange(changes));

        this.changes.push(...changes);
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Shortcut to add a value at a given location. This usually is used to add array-items
     * @return new root node
     */
    addValue(pointer: string) {
        const schema = this.draft.getSchema({ pointer, data: json(this.root) });
        const value = this.draft.getTemplate(undefined, schema, this.templateOptions);
        return this.setValue(pointer, value);
    }

    /**
     * Delete the value at the given json-pointer location
     * @return new root node
     */
    removeValue(pointer: string) {
        const [state, changes] = removeTarget(this.draft, this.root, pointer);
        if (isJsonError(state)) {
            console.error(`error removing '${pointer}'`);
            console.log(state);
            return this.root;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        const [parent] = gp.splitLast(pointer);

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using remove
        validateState(this.draft, state, parent);
        this.changes.push(...changes);
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Move the referenced array-item to another array position
     */
    moveItem(pointer: string, to: number) {
        const [parent, from] = gp.splitLast(pointer);
        // console.log('move', parent, from, to);
        const [state, changes] = moveItem(this.draft, this.root, parent, parseInt(`${from}`), to);
        if (isJsonError(state)) {
            console.error(`error moving nodes in '${pointer}'`);
            console.log(state);
            return this.root;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, pointer);
        this.changes.push(...changes);
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Append an item defined by a json-schema to the target array
     */
    appendItem(node: ArrayNode, itemSchema: JsonSchema) {
        const value = this.draft.getTemplate(null, itemSchema, this.templateOptions);
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = set(this.draft, this.root, pointer, value);
        if (isJsonError(state)) {
            console.error(`error apending item from schema '${node.pointer}'`);
            console.log(state);
            return this.root;
        }

        if (changes === undefined) {
            throw new Error('invalid state');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, node.pointer);
        const oldState = this.root;
        let newState = state;
        this.root = newState;
        newState = this.runPlugins(oldState, newState, changes);
        if (isJsonError(newState)) {
            console.error(`error from state returned by plugins '${node.pointer}'`);
            console.log(newState);
            newState = state;
        }
        this.root = newState;
        return this.root;
    }

    /**
     * @return a list of available json subschemas to insert
     */
    getArrayAddOptions(node: ArrayNode) {
        const schema = this.draft.getSchema({ pointer: node.pointer, data: json(this.root) });
        const selections = this.draft.getChildSchemaSelection(node.children.length, schema);
        if (isJsonError(selections)) {
            return [{ type: 'string' }];
        }
        return selections;
    }
}

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
