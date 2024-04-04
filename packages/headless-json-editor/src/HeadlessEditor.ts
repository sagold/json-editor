import gp from '@sagold/json-pointer';
import { createNode } from './node/createNode';
import { deepEqual } from 'fast-equals';
import { Draft, DraftConfig, JsonEditor, JsonError } from 'json-schema-library';
import { getErrors } from './node/getErrors';
import { getNodeList } from './node/getNodeList';
import { getNode } from './node/getNode';
import { getData } from './node/getData';
import { JsonSchema, Change, Node, ParentNode, ArrayNode, isJsonError, PluginEvent, DoneEvent, ValidationEvent } from './types';
import { moveNode } from './transform/moveNode';
import { removeNode } from './transform/removeNode';
import { setValue } from './transform/setValue';
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
    Options extends Parameters<Plugin>[1] = any,
    Signature extends Record<string, unknown> = Record<string, unknown>,
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
    /** if json-schema default-values should be extended (required properties, min-length of items). Defaults to false */
    extendDefaults?: boolean;
    [p: string]: unknown;
} & O;


// @todo test setSchema
// @todo difference between setValue and setData (root?)?
export class HeadlessEditor<Data = unknown> {
    /** Editor root node */
    root: Node;
    /** Json-Schema API */
    draft: Draft;
    /** list of active plugins */
    plugins: PluginInstance[] = [];
    /** input options for this editor instance */
    options: HeadlessEditorOptions<Data>;
    templateOptions = {
        addOptionalProps: false,
        extendDefaults: false
    };

    constructor(options: HeadlessEditorOptions<Data>) {
        const { schema, data = {}, plugins = [], draftConfig, addOptionalProps = false, extendDefaults = false } = options;
        this.options = options;
        // setup getTemplate options for json-schema-library so that options are used by createNode and others
        this.templateOptions.addOptionalProps = addOptionalProps;
        this.templateOptions.extendDefaults = extendDefaults;
        const config = draftConfig ?? {};
        config.templateDefaultOptions = {
            ...(config.templateDefaultOptions ?? {}),
            ...this.templateOptions
        }
        this.draft = new JsonEditor(schema, config);
        this.root = createNode<ParentNode>(
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
        return gp.get(getData(this.root), pointer);
    }

    /**
     * Set new data and rebuild node tree
     * @return new root node
     */
    setData(data?: Data): Node {
        const { draft } = this;
        const previousState = this.root;
        this.root = createNode<ParentNode>(
            draft,
            draft.getTemplate(data, draft.getSchema(), {
                addOptionalProps: false,
                extendDefaults: this.templateOptions.extendDefaults
            })
        );
        this.options.validate === true && this.validate();
        const changes: Change[] = getNodeList(this.root).map((node) => ({ type: 'create', node }));
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
        return this.setData(getData(this.root) as Data);
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
        const validationErrors = getErrors(this.root);
        const event: ValidationEvent = { type: 'validation', previous: this.root, next: state, errors: validationErrors };
        this.root = this.runPlugins(this.root, state, [event]);
        return validationErrors;
    }

    /**
     * Get current validation errors of node-tree
     * @return validation errors of state
     */
    getErrors() {
        return this.root ? getErrors(this.root) : [];
    }

    /**
     * Set new editor state (new tree of nodes)
     * @return new root node
     */
    setState(state: Node, changes: PluginEvent[]) {
        this.root = this.runPlugins(this.root, state, changes);
        // @todo validate again? in general, when to validate?
        return this.root;
    }

    /**
     * Get current root-node
     * @return root node
     */
    getNode(): Node;
    /**
     * Get current node at json-pointer location
     * @return node at requested location or json-error
     */
    getNode(pointer: string): Node | JsonError;
    getNode(pointer?: string) {
        if (pointer && typeof pointer === 'string' && pointer.replace(/^[/#]+/, '') !== '') {
            return getNode(this.root, pointer);
        }
        return this.root;
    }

    /**
     * Get a plugin by pluginId
     */
    findPlugin(pluginId: string) {
        return this.plugins.find((p) => p.id === pluginId);
    }

    addPlugin<T extends Plugin>(plugin: T, pluginOptions?: Parameters<T>[1]) {
        const p = plugin(this, pluginOptions);
        if (p && p.id) {
            this.plugins.push(p);
            return p as ReturnType<T>;
        }
        return undefined;
    }

    runPlugins(oldState: Node, newState: Node, changes: PluginEvent[]) {
        const plugins = this.plugins;
        // @notify change
        let currentRoot = newState;
        changes.forEach((change) => {
            plugins.forEach((p) => {
                const [modifiedState, newChanges] = p.onEvent(newState, change) ?? [];
                if (modifiedState) {
                    currentRoot = modifiedState
                    if (newChanges && newChanges.length > 0) {
                        changes.push(...newChanges);
                        validateState(this.draft, currentRoot, getRootChange(newChanges));
                    }
                }
            });
        });
        this.root = currentRoot;
        // @notify done
        const done: DoneEvent = { type: 'done', previous: oldState, next: currentRoot, changes };
        plugins.forEach((p) => p.onEvent(currentRoot, done));
        return currentRoot;
    }

    /**
     * Set value at given data-location
     * @param pointer - json-pointer in data of target value
     * @param value - value to set at location
     * @return new root node or current one if nothing changed
     */
    setValue(pointer: string, value: unknown) {
        const previousNode = getNode(this.root, pointer);
        if (!isJsonError(previousNode)) {
            const previousValue = getData(previousNode);
            if (deepEqual(previousValue, value)) {
                return this.root;
            }
        }

        const [state, changes] = setValue(this.draft, this.root, pointer, value);
        if (isJsonError(state)) {
            console.error(`error setting '${pointer}' = ${JSON.stringify(value)}`);
            console.log(state);
            return this.root;
        }

        if (changes === undefined) {
            throw new Error('HeadlessEditor: set should have provided changes');
        }

        // validate assigns errors directly no node, which is okay here,
        // since we already cloned this location using set
        validateState(this.draft, state, getRootChange(changes));

        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Shortcut to add a value at a given location. This usually is used to add array-items
     * @return new root node
     */
    addValue(pointer: string) {
        const schema = this.draft.getSchema({ pointer, data: getData(this.root) });
        const value = this.draft.getTemplate(undefined, schema, this.templateOptions);
        return this.setValue(pointer, value);
    }

    /**
     * Delete the value at the given json-pointer location
     * @return new root node
     */
    removeValue(pointer: string) {
        const [state, changes] = removeNode(this.draft, this.root, pointer);
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
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Move the referenced array-item to another array position
     */
    moveItem(pointer: string, to: number) {
        const [parent, from] = gp.splitLast(pointer);
        // console.log('move', parent, from, to);
        const [state, changes] = moveNode(this.draft, this.root, parent, parseInt(`${from}`), to);
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
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Append an item defined by a json-schema to the target array
     */
    appendItem(node: ArrayNode, itemSchema: JsonSchema) {
        const value = this.draft.getTemplate(null, itemSchema, this.templateOptions);
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = setValue(this.draft, this.root, pointer, value);
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
        const schema = this.draft.getSchema({ pointer: node.pointer, data: getData(this.root) });
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
    const validationTarget = gp.join(pointer, '..');
    let startNode = getNode(root, validationTarget);
    if (startNode.type === 'error') {
        // if the node no longer exists, fallback to validate all
        startNode = root;
    }
    updateErrors(draft, startNode);
}
