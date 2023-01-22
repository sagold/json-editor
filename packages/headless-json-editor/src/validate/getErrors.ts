import { Draft, JsonPointer, JsonError } from 'json-schema-library';
import { Node, isJsonError } from '../types';
import { json } from '../node/json';
import { get } from '../node/get';

// function filterAllErrors(errors: any[]): (JsonError | Promise<JsonError | undefined>)[] {
//     return errors.filter((item) => isJsonError(item) || item instanceof Promise);
// }

/**
 * validate current node and return the validation errors
 */
export function getErrors(draft: Draft, root: Node, pointer: JsonPointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
    }

    const errors: (JsonError | Promise<JsonError | undefined>)[] = draft
        .validate(json(startNode), startNode.schema, startNode.pointer)
        .flat(Infinity)
        .filter((item) => {
            return item instanceof Promise || isJsonError(item);
        });

    return errors;
}

/**
 * splits validation errors into errors and async errors
 */
export function splitErrors(
    errors: (JsonError | Promise<JsonError | undefined>)[]
): [JsonError[], Promise<JsonError[]>[]] {
    const syncErrors: JsonError[] = [];
    const asyncErrors: Promise<JsonError[]>[] = [];
    for (let i = 0, l = errors.length; i < l; i += 1) {
        if (isJsonError(errors[i])) {
            syncErrors.push(errors[i] as JsonError);
        } else if (errors[i] instanceof Promise) {
            // @ts-ignore
            asyncErrors.push(errors[i]);
        }
    }
    return [syncErrors, asyncErrors];
}
