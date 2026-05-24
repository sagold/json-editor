import gp from '@sagold/json-pointer';
import { createNode } from './node/createNode';
import { deepEqual } from 'fast-equals';
import { CompileOptions, Draft, JsonError, SchemaNode, compileSchema } from 'json-schema-library';
import { getErrors } from './node/getErrors';
import { getNodeList } from './node/getNodeList';
import { getNode } from './node/getNode';
import { getData } from './node/getData';
import {
    JsonSchema,
    Change,
    JsonNode,
    ParentNode,
    ArrayNode,
    isJsonError,
    PluginEvent,
    DoneEvent,
    ValidationEvent
} from './types';
import { moveNode } from './transform/moveNode';
import { removeNode } from './transform/removeNode';
import { setValue } from './transform/setValue';
import { unlinkAll } from './transform/unlinkAll';
import { updateErrors } from './validate/updateErrors';
import { uuid } from './utils/uuid';
import { drafts as defaultDrafts } from './compileSchema';

export type O = Record<string, unknown>;

export type PluginInstance<Signature extends O = O> = {
    id: string;
    /** Called for all events, e.g. `create`, `update`, `delete`, `undo`, etc.
     *  Each event loop is finished by a done-event, which contains a list of modified nodes
     *
     *  `onEvent` may return a new root-node along with a list of changes
     */
    onEvent: (root: JsonNode, event: PluginEvent) => void | [JsonNode, Change[]];
    /** Called when Editor before Editor is going to be destroyed */
    onDestroy?: () => void;
} & Signature;

export type Plugin<
    Options extends Parameters<Plugin>[1] = any,
    Signature extends Record<string, unknown> = Record<string, unknown>,
    Editor extends HeadlessEditor = HeadlessEditor
> = (he: Editor, options: Options) => PluginInstance<Signature> | undefined;

export type HeadlessEditorOptions<Data = unknown> = {
    /** The JSON Schema describing the form and its resulting data. JSON Schema `type` keywords are required for json-editor to work correctly. */
    schema: JsonSchema;
    /** The initial, partial data to be used to fill the form with values. The data has to match the JSON Schema or it will be ignored or invalidated in the we form */
    data?: Data;
    drafts?: Draft[];
    /* list of active plugins */
    plugins?: Plugin[];
    /** if data should be initially validated */
    validate?: boolean;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    /** if json-schema default-values should be extended (required properties, min-length of items). Defaults to false */
    extendDefaults?: boolean;
    /** Remove data that does not match input schema. Defaults to false */
    removeInvalidData?: boolean;
    [p: string]: unknown;
} & O;

// @todo test setSchema
// @todo difference between setValue and setData (root?)?
export class HeadlessEditor<Data = unknown> {
    readonly id: string = uuid();
    /** Editor root node */
    root: JsonNode;
    /** JSON Schema API */
    schemaNode: SchemaNode;
    /** JSON Schema API options */
    schemaNodeConfig: CompileOptions;
    /** list of active plugins */
    plugins: PluginInstance[] = [];
    /** input options for this editor instance */
    options: HeadlessEditorOptions<Data>;

    constructor(options: HeadlessEditorOptions<Data>) {
        const {
            schema,
            data = {},
            plugins = [],
            drafts,
            addOptionalProps = false,
            extendDefaults = false,
            removeInvalidData = false
        } = options;
        this.options = options;
        // setup getTemplate options for json-schema-library so that options are used by createNode and others
        this.schemaNodeConfig = {
            drafts: drafts ?? defaultDrafts,
            formatAssertion: true,
            getDataDefaultOptions: {
                addOptionalProps,
                extendDefaults,
                removeInvalidData
            }
        };

        this.schemaNode = compileSchema(schema, this.schemaNodeConfig);
        this.root = createNode<ParentNode>(this.schemaNode, this.schemaNode.getData(data));
        plugins.forEach((p) => this.addPlugin(p));
        if (options.validate) {
            this.validate();
        }
    }

    get optionalProperties() {
        return this.schemaNode.context.getDataDefaultOptions?.addOptionalProps === false;
    }

    /**
     * Returns the current json data
     * @param pointer   A JSON Pointer string of the data to return. Use `undefined` or `""` to get all data or specify a path like `/header` or `/todo/4` to get the data from the requested location
     */
    getData(pointer = '#') {
        return gp.get(getData(this.root), pointer);
    }

    /**
     * Get current data or a subset of the data specified by a JSON Pointer
     *
     * @param data to set
     * @returns new root node
     */
    setData(data?: Data): JsonNode {
        const { schemaNode } = this;
        const previousState = this.root;
        this.root = createNode<ParentNode>(
            schemaNode,
            schemaNode.getData(data, {
                addOptionalProps: false
            })
        );
        if (this.options.validate === true) {
            this.validate();
        }
        const changes: Change[] = getNodeList(this.root).map((node) => ({ type: 'create', node }));
        this.root = this.runPlugins(previousState, this.root, changes);
        return this.root;
    }

    /**
     * Shortcut to return default data based on json-schema only
     * @param schema    json-schema to get default data from. Defaults to current schema
     * @param data  optional data to merge with default data
     * @returns default data confirming to json-schema
     */
    getTemplateData(schema: JsonSchema, data = null) {
        const node = this.schemaNode.compileSchema(schema);
        return node.getData(data);
    }

    /**
     * @returns Input JSON Schema of the current form
     */
    getSchema() {
        return this.schemaNode.schema;
    }

    /**
     * Replace the JSON Schema and recreate the JsonNode tree of the form
     * @param schema    JSON Schema of the new form
     * @returns The new root node for the given JSON Schema
     */
    setSchema(schema: JsonSchema) {
        this.schemaNode = compileSchema(schema, this.schemaNodeConfig);
        return this.setData(getData(this.root) as Data);
    }

    /**
     * Run validation for the current form and update the list of errors
     * @returns List of validation errors. See [getErrors](#getErrors) for details
     */
    validate() {
        if (this.root == null) {
            return [];
        }
        const state = unlinkAll(this.root);
        validateState(state);
        const validationErrors = getErrors(this.root);
        const event: ValidationEvent = {
            type: 'validation',
            previous: this.root,
            next: state,
            errors: validationErrors
        };
        this.root = this.runPlugins(this.root, state, [event]);
        return validationErrors;
    }

    /**
     * Get current validation errors of node-tree.
     * An error contains the following properties
     * `{ type: "error", code: string, message: string, data }`.
     * The property `data` contains details to the error.
     * For further details check [json-schema-library#validate](https://github.com/sagold/json-schema-library#validate)
     *
     * @returns Current list of form validation errors of the current state.
     */
    getErrors() {
        return this.root ? getErrors(this.root) : [];
    }

    /**
     * Set new editor state (new tree of nodes)
     * @returns new root node
     */
    setState(state: JsonNode, changes: PluginEvent[]) {
        this.root = this.runPlugins(this.root, state, changes);
        // @todo validate again? in general, when to validate?
        return this.root;
    }

    /**
     * Get current root-node
     * @returns root node
     */
    getNode(): JsonNode;
    /**
     * Get current node at json-pointer location
     * @returns node at requested location or json-error
     */
    getNode(pointer: string): JsonNode | JsonError;
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

    addPlugin<T extends Plugin>(plugin: T, pluginOptions?: Parameters<T>[1]): ReturnType<T> | undefined {
        const instance = plugin(this, pluginOptions);
        if (instance && instance.id) {
            this.plugins = this.plugins.filter((plugin) => {
                if (plugin.id === instance.id) {
                    plugin.onDestroy?.();
                    return false;
                }
                return true;
            });
            this.plugins.push(instance);
            return instance as ReturnType<T>;
        }
        return undefined;
    }

    /**
     * Runs all plugins per given change, allowing them to return a modified newState
     *
     * @returns The new root node
     */
    runPlugins(oldState: JsonNode, newState: JsonNode, changes: PluginEvent[]) {
        const plugins = this.plugins;
        // @notify change
        let currentRoot = newState;
        changes.forEach((change) => {
            plugins.forEach((p) => {
                const [modifiedState, newChanges] = p.onEvent(newState, change) ?? [];
                if (modifiedState) {
                    currentRoot = modifiedState;
                    if (newChanges && newChanges.length > 0) {
                        changes.push(...newChanges);
                        validateState(currentRoot, getRootChange(newChanges));
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
     * Set or replace a value at given data location
     * @param pointer   json-pointer in data of target value
     * @param value     value to set at location
     * @returns new root node or current one if nothing changed
     */
    setValue(pointer: string, value: unknown) {
        const previousNode = getNode(this.root, pointer);
        if (!isJsonError(previousNode)) {
            const previousValue = getData(previousNode);
            if (deepEqual(previousValue, value)) {
                return this.root;
            }
        }

        const [state, changes] = setValue(this.root, pointer, value);
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
        validateState(state, getRootChange(changes));

        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Add a value at a given location. This usually is used to add array-items
     * @caveat addValue **only supports adding properties**
     *
     * @param pointer   A JSON Pointer string to the value to add
     * @returns The new root node
     */
    addValue(pointer: string) {
        const { node, error } = this.schemaNode.getNode(pointer, getData(this.root));
        if (node) {
            const value = node.getData();
            return this.setValue(pointer, value);
        }
        if (error) {
            console.error(`addValue: Invalid path '${pointer}' given`);
        } else {
            console.log(`addValue: no schema found at '${pointer}'`);
        }
        return this.root;
    }

    /**
     * Delete the value at the given JSON Pointer
     * @param pointer   A JSON Pointer string to the node which should be removed. Specify a data path like `/header` or `/todo/4` to remove the node from the specified location
     * @returns The new root node
     */
    removeValue(pointer: string) {
        const [state, changes] = removeNode(this.root, pointer);
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
        validateState(state, parent);
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Move the referenced **array-item** to another array position
     * @param pointer   A JSON Pointer string to the node
     * @param to    The index to move the array item to
     * @returns The new root node
     */
    moveItem(pointer: string, to: number) {
        const [parent, from] = gp.splitLast(pointer);
        // console.log('move', parent, from, to);
        const [state, changes] = moveNode(this.root, parent, parseInt(`${from}`), to);
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
        validateState(state, pointer);
        this.root = this.runPlugins(this.root, state, changes);
        return this.root;
    }

    /**
     * Add an item defined by a JSON Schema to the end of the target array
     * @param node  ArrayNode of item
     * @param itemSchema    JSON Schema of the item to add
     * @returns The new root node
     */
    appendItem(node: ArrayNode, itemSchema: JsonSchema) {
        const itemSchemaNode = this.schemaNode.compileSchema(itemSchema);
        const value = itemSchemaNode.getData();
        const pointer = `${node.pointer}/${node.children.length}`;
        const [state, changes] = setValue(this.root, pointer, value);
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
        validateState(state, node.pointer);
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
     * Get all available items that can be added next to the specified array
     * @returns List of available JSON subschemas to insert into the array. Access the JSON Schema of each option by `SchemaNode.schema`. For more details see [json-schema-library#schemanode-methods](https://github.com/sagold/json-schema-library#schemanode-methods)
     */
    getArrayAddOptions(node: ArrayNode): SchemaNode[] {
        const selections = node.schemaNode.getChildSelection(node.children.length);
        if (selections == null) {
            console.log('failed node', node);
            console.error(`Failed fetching child options for ${node.pointer}`);
            return [];
        }

        if (isJsonError(selections) || selections.length === 0) {
            return [node.schemaNode.compileSchema({ type: 'string' })];
        }

        const result = selections.filter((v) => v != null);
        if (selections.length !== result.length) {
            console.warn('missing array add options. Probably incomplete schema for', node.schemaNode.schema);
            console.log(node.schemaNode);
        }
        return result;
    }

    /**
     * destroys editor instance including all plugins, releasing used memory.
     *
     * @caveat plugins will receive an onDestroy call once and are responsible to release memory on their own
     */
    destroy() {
        if (this.plugins == null) {
            return;
        }
        this.plugins.forEach((p) => p.onDestroy?.());
        // @ts-expect-error unresolved property
        ['root', 'schemaNode', 'plugins', 'options'].forEach((property) => (this[property] = null));
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

function validateState(root: JsonNode, pointer = '#') {
    // always evaluate parent as it can be that children are referenced in parent
    const validationTarget = gp.join(pointer, '..');
    let startNode = getNode(root, validationTarget);
    if (startNode.type === 'error') {
        // if the node no longer exists, fallback to validate all
        startNode = root;
    }
    updateErrors(startNode);
}
