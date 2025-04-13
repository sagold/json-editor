import { JsonError } from 'json-schema-library';
import { Node, isJsonError } from '../types';
import { getData } from '../node/getData';

function validationError(item: JsonError) {
    return item instanceof Promise || isJsonError(item);
}

/**
 * Perform json-schema validation on node and its child nodes. Does not
 * modify nodes.
 *
 * @return list of validation errors
 */
export function validateNode(node: Node) {
    const errors: (JsonError | Promise<JsonError | undefined>)[] = node.schemaNode
        .validate(getData(node), node.pointer)
        .errors.flat(Infinity)
        .filter(validationError);

    return errors;
}

/**
 * splits validation errors into errors and async errors
 */
export function splitErrors(
    errors: (JsonError | Promise<JsonError | undefined>)[]
): [JsonError[], Promise<JsonError | undefined>[]] {
    const syncErrors: JsonError[] = [];
    const asyncErrors: Promise<JsonError | undefined>[] = [];
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
