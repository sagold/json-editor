// settings
import { setErrorMessages } from './settings';
// create
import { create, getOptions, DefaultNodeOptions } from './node/create';
import { json } from './node/json';
// traversal
import { errors } from './node/errors';
import { find } from './node/find';
import { flat } from './node/flat';
import { get } from './node/get';
import { trace } from './node/trace';
import { getChildNode } from './node/getChildNode';
// transformation
import { set } from './transform/set';
import { remove } from './transform/remove';
import { move } from './transform/move';
import { unlinkAll } from './transform/unlinkAll';
import { unlinkPath } from './transform/unlinkPath';
import { update, updateSchema, updateOptions } from './transform/update';
// hje
import {
    HeadlessJsonEditor
} from './HeadlessJsonEditor';
import {
    Plugin, PluginInstance,
    PluginEvent, PluginConfig,
    HeadlessJsonEditorOptions,
    HeadlessJsonEditorInterface
} from './plugins/Plugin';
// plugins
import { EventLoggerPlugin } from './plugins/EventLoggerPlugin';
import { RemoteEnumOptionsPlugin } from './plugins/RemoteEnumOptionsPlugin';
import { OnChangePlugin, OnChangeListener } from './plugins/OnChangePlugin';
import { HistoryPlugin, HistoryPluginInstance } from './plugins/HistoryPlugin';
// validation
import { updateErrors } from './validate/updateErrors';
import { getErrors, splitErrors } from './validate/getErrors';
// jlib export
import { isJsonError, JsonError } from 'json-schema-library';
// bundled tools
export { deepEqual } from 'fast-equals';
// types and type guards
import {
    ArrayNode,
    BooleanNode,
    Change,
    JsonSchema,
    Node,
    NodeType,
    NullNode,
    NumberNode,
    ObjectNode,
    ParentNode,
    StringNode,
    ValueNode,
    isNode,
    isParentNode,
    isValueNode
} from './types';

export {
    create,
    errors,
    EventLoggerPlugin,
    find,
    flat,
    get,
    getChildNode,
    getErrors,
    getOptions,
    HeadlessJsonEditor,
    HistoryPlugin,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    json,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    setErrorMessages,
    splitErrors,
    trace,
    unlinkAll,
    unlinkPath,
    update,
    updateErrors,
    updateOptions,
    updateSchema
};

export type {
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
    HeadlessJsonEditorInterface,
    HeadlessJsonEditorOptions,
    HistoryPluginInstance,
    JsonSchema,
    JsonError,
    Plugin,
    PluginConfig,
    PluginInstance,
    PluginEvent,
    Node,
    NodeType,
    NullNode,
    NumberNode,
    ObjectNode,
    OnChangeListener,
    ParentNode,
    StringNode,
    ValueNode
};
