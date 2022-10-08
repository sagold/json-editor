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
import { updateSchema, updateOptions } from './transform/update';
// convenience: append, prepend, insert

// hje
import { HeadlessJsonEditor, HeadlessJsonEditorOptions, Plugin } from './HeadlessJsonEditor';

// plugins
import { RemoteEnumOptionsPlugin } from './plugins/RemoteEnumOptionsPlugin';
import { createOnChangePlugin, OnChangeListener } from './plugins/OnChangePlugin';
import { createHistoryPlugin, HistoryPlugin } from './plugins/HistoryPlugin';

// validation
import { updateErrors } from './validate/updateErrors';
import { getErrors, splitErrors } from './validate/getErrors';

import {
    ArrayNode,
    BooleanNode,
    Change,
    JSONSchema,
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
    isValueNode,
    isJSONError
} from './types';

export {
    create,
    errors,
    find,
    flat,
    get,
    getChildNode,
    getErrors,
    getOptions,
    json,
    move,
    remove,
    set,
    splitErrors,
    trace,
    updateOptions,
    updateSchema,
    updateErrors,
    HeadlessJsonEditor,
    Plugin,
    isNode,
    isParentNode,
    isValueNode,
    isJSONError,
    RemoteEnumOptionsPlugin,
    createOnChangePlugin,
    createHistoryPlugin
};

export type {
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
    HeadlessJsonEditorOptions,
    HistoryPlugin,
    JSONSchema,
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
