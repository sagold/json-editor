import { Draft, JsonPointer, JsonError } from 'json-schema-library';
import { Node, isJsonError } from '../types';
import { getData } from '../node/getData';
import { getNode } from '../node/getNode';

// function filterAllErrors(errors: any[]): (JsonError | Promise<JsonError | undefined>)[] {
//     return errors.filter((item) => isJsonError(item) || item instanceof Promise);
// }

function validationError(item: JsonError) {
    return item instanceof Promise || isJsonError(item);
}

/**
 * validate current node and return the validation errors
 */
export function getErrors(draft: Draft, root: Node, pointer: JsonPointer = '#') {
    const startNode = getNode(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
    }

    const errors: (JsonError | Promise<JsonError | undefined>)[] = draft
        .validate(getData(startNode), startNode.schema, startNode.pointer)
        .flat(Infinity)
        .filter(validationError);

    return errors;
}

/**
 * splits validation errors into errors and async errors
 */
export function splitErrors(
    errors: (JsonError | Promise<JsonError | undefined>)[]
): [JsonError[], Promise<(JsonError | undefined)>[]] {
    const syncErrors: JsonError[] = [];
    const asyncErrors: Promise<(JsonError | undefined)>[] = [];
    for (let i = 0, l = errors.length; i < l; i += 1) {
        const error = errors[i];
        if (isJsonError(error)) {
            syncErrors.push(error as JsonError);
        } else if (error instanceof Promise) {
            asyncErrors.push(error);
        }
    }
    return [syncErrors, asyncErrors];
}
