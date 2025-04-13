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
    Node,
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
import { jsonEditorDraft } from './compileSchema';

export type O = Record<string, unknown>;

export type PluginInstance<Signature extends O = O> = {
    id: string;
    /** Called for all events, e.g. `create`, `update`, `delete`, `undo`, etc.
     *  Each event loop is finished by a done-event, which contains a list of modified nodes
     *
     *  `onEvent` may return a new root-node along with a list of changes
     */
    onEvent: (root: Node, event: PluginEvent) => void | [Node, Change[]];
    /** Called when Editor before Editor is going to be destroyed */
    onDestroy?: () => void;
} & Signature;

export type Plugin<
    Options extends Parameters<Plugin>[1] = any,
    Signature extends Record<string, unknown> = Record<string, unknown>,
    Editor extends HeadlessEditor = HeadlessEditor
> = (he: Editor, options: Options) => PluginInstance<Signature> | undefined;

export type HeadlessEditorOptions<Data = unknown> = {
    schema: JsonSchema;
    data?: Data;
    drafts?: Draft[];
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
    id: string = uuid();
    /** Editor root node */
    root: Node;
    /** Json-Schema API */
    schemaNode: SchemaNode;
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
            drafts: drafts ?? [jsonEditorDraft],
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
        options.validate && this.validate();
    }

    get optionalProperties() {
        return this.schemaNode.context.getDataDefaultOptions?.addOptionalProps === false;
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
     * @param [data] - new data to set
     * @return new root node
     */
    setData(data?: Data): Node {
        const { schemaNode } = this;
        const previousState = this.root;
        this.root = createNode<ParentNode>(
            schemaNode,
            schemaNode.getData(data, {
                addOptionalProps: false
            })
        );
        this.options.validate === true && this.validate();
        const changes: Change[] = getNodeList(this.root).map((node) => ({ type: 'create', node }));
        this.root = this.runPlugins(previousState, this.root, changes);
        return this.root;
    }

    /**
     * Shortcut to return default data based on json-schema only
     * @param [schema] - json-schema to get default data from. Defaults to current schema
     * @param [data] - optional data to merge with default data
     * @return default data confirming to json-schema
     */
    getTemplateData(schema: JsonSchema, data = null) {
        const node = this.schemaNode.compileSchema(schema);
        return node.getData(data);
    }

    /**
     * @return current json-schema
     */
    getSchema() {
        return this.schemaNode.schema;
    }

    /**
     * sets a new or modified json-schema and updates data and nodes
     * @param schema - new json-schema to set
     * @return new root node
     */
    setSchema(schema: JsonSchema) {
        this.schemaNode = compileSchema(schema, this.schemaNodeConfig);
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

    runPlugins(oldState: Node, newState: Node, changes: PluginEvent[]) {
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
     * Shortcut to add a value at a given location. This usually is used to add array-items
     * @return new root node
     */
    addValue(pointer: string) {
        const { node, error } = this.schemaNode.getNodeChild(pointer, getData(this.root));
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
     * Delete the value at the given json-pointer location
     * @return new root node
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
     * Move the referenced array-item to another array position
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
     * Append an item defined by a json-schema to the target array
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
     * @return a list of available json subschemas to insert
     */
    getArrayAddOptions(node: ArrayNode) {
        const selections = node.schemaNode.getChildSelection(node.children.length);
        if (isJsonError(selections) || selections.length === 0) {
            return [{ type: 'string' }];
        }
        return selections;
    }

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

function validateState(root: Node, pointer = '#') {
    // always evaluate parent as it can be that children are referenced in parent
    const validationTarget = gp.join(pointer, '..');
    let startNode = getNode(root, validationTarget);
    if (startNode.type === 'error') {
        // if the node no longer exists, fallback to validate all
        startNode = root;
    }
    updateErrors(startNode);
}
