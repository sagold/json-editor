// settings
import { setErrorMessages } from './settings';
// create
import { createNode, getOptions, DefaultNodeOptions } from './node/createNode';
import { getData } from './node/getData';
// traversal
import { errors } from './node/errors';
import { find } from './node/find';
import { getNodeList } from './node/getNodeList';
import { getNode } from './node/getNode';
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
    HeadlessEditor,
    HeadlessEditorOptions,
    Plugin, PluginInstance,
} from './HeadlessEditor';
// plugins
import { EventLoggerPlugin } from './plugins/EventLoggerPlugin';
import { RemoteEnumOptionsPlugin } from './plugins/RemoteEnumOptionsPlugin';
import { OnChangePlugin, OnChangeListener } from './plugins/OnChangePlugin';
import { HistoryPlugin } from './plugins/HistoryPlugin';
import { SetOptionTitleToPlugin } from './plugins/SetOptionTitleToPlugin';
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
    PluginEvent,
    StringNode,
    ValueNode,
    isChange,
    isNode,
    isParentNode,
    isValueNode
} from './types';

export {
    createNode,
    errors,
    EventLoggerPlugin,
    find,
    getNodeList,
    getNode,
    getChildNode,
    getErrors,
    getOptions,
    HeadlessEditor,
    HistoryPlugin,
    isChange,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    getData,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    setErrorMessages,
    SetOptionTitleToPlugin,
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
    HeadlessEditorOptions,
    JsonSchema,
    JsonError,
    Plugin,
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
