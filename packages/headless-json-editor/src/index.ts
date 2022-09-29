// create
import { create } from './node/create';
import { json } from './node/json';
// traversal
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

// jst
export { JST, Plugin } from './JST';

// plugins
export { RemoteEnumOptionsPlugin } from './plugins/RemoteEnumOptionsPlugin';
export { createOnChangePlugin, OnChangeListener } from './plugins/OnChangePlugin';

// validation
import { validate } from './validate/validate';
import { getErrors, splitErrors } from './validate/getErrors';

export {
    create,
    find,
    flat,
    get,
    getChildNode,
    json,
    trace,
    move,
    remove,
    set,
    updateSchema,
    updateOptions,
    validate,
    getErrors,
    splitErrors
};
export { isNode, isParentNode, isValueNode, isJsonError } from './node/types';

export type {
    JSONSchema,
    Node,
    ParentNode,
    ValueNode,
    ArrayNode,
    ObjectNode,
    StringNode,
    NumberNode,
    NullNode,
    BooleanNode,
    Change,
    NodeType
} from './node/types';
