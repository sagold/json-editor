import { isJSONError, isParentNode } from '../types';
import { json } from '../node/json';
import { get } from '../node/get';
import { splitErrors } from './getErrors';
function each(node, cb) {
    cb(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => each(child, cb));
    }
}
function filterErrors(errors) {
    return [errors].flat(Infinity).filter(isJSONError);
}
/**
 * perform validation and assign errors to corresponding nodes
 */
export async function updateErrors(draft, root, pointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
    }
    const pointerToErrors = {};
    // reset errors
    each(startNode, (node) => {
        node.errors = [];
        pointerToErrors[node.pointer] = node.errors;
    });
    // retrieve errors
    const errors = draft.validate(json(startNode), startNode.schema, startNode.pointer).flat(Infinity);
    const [syncErrors, asyncErrors] = splitErrors(errors);
    // assign errors
    syncErrors.forEach((err) => {
        var _a, _b;
        const pointer = (_b = (_a = err.data) === null || _a === void 0 ? void 0 : _a.pointer) !== null && _b !== void 0 ? _b : '#';
        if (pointerToErrors[pointer] == null) {
            // retrieve new (dynamic) node
            pointerToErrors[pointer] = get(root, pointer).errors;
        }
        pointerToErrors[pointer].push(err);
    });
    // await and assign async errors
    asyncErrors.forEach((validation) => validation.then((errors) => {
        // console.log(errors);
        filterErrors(errors).forEach((err) => {
            var _a, _b, _c;
            const pointer = (_b = (_a = err.data) === null || _a === void 0 ? void 0 : _a.pointer) !== null && _b !== void 0 ? _b : '#';
            // schema may change
            pointerToErrors[pointer] = (_c = pointerToErrors[pointer]) !== null && _c !== void 0 ? _c : [];
            pointerToErrors[pointer].push(err);
        });
    }));
    return Promise.all(asyncErrors);
}
//# sourceMappingURL=updateErrors.js.map