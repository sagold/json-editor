import { isJSONError } from '../types';
import { json } from '../node/json';
import { get } from '../node/get';
// function filterAllErrors(errors: any[]): (JSONError | Promise<JSONError | undefined>)[] {
//     return errors.filter((item) => isJSONError(item) || item instanceof Promise);
// }
/**
 * validate current node and return the validation errors
 */
export function getErrors(draft, root, pointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
    }
    const errors = draft
        .validate(json(startNode), startNode.schema, startNode.pointer)
        .flat(Infinity);
    return errors.filter((item) => isJSONError(item) || item instanceof Promise);
}
/**
 * splits validation errors into errors and async errors
 */
export function splitErrors(errors) {
    const syncErrors = [];
    const asyncErrors = [];
    for (let i = 0, l = errors.length; i < l; i += 1) {
        if (isJSONError(errors[i])) {
            syncErrors.push(errors[i]);
        }
        else if (errors[i] instanceof Promise) {
            // @ts-ignore
            asyncErrors.push(errors[i]);
        }
    }
    return [syncErrors, asyncErrors];
}
//# sourceMappingURL=getErrors.js.map