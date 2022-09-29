// create
import { create } from './node/create';
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
export { HeadlessJsonEditor, Plugin } from './HeadlessJsonEditor';

// plugins
export { RemoteEnumOptionsPlugin } from './plugins/RemoteEnumOptionsPlugin';
export { createOnChangePlugin, OnChangeListener } from './plugins/OnChangePlugin';

// validation
import { updateErrors } from './validate/updateErrors';
import { getErrors, splitErrors } from './validate/getErrors';

export {
    create,
    errors,
    find,
    flat,
    get,
    getChildNode,
    getErrors,
    json,
    move,
    remove,
    set,
    splitErrors,
    trace,
    updateOptions,
    updateSchema,
    updateErrors
};
export { isNode, isParentNode, isValueNode, isJSONError } from './types';

export type {
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
    DefaultNodeOptions
} from './types';
