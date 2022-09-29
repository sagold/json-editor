import { Interface, JSONPointer, JSONError } from 'json-schema-library';
import { Node, isJsonError } from '../node/types';
import { json } from '../node/json';
import { get } from '../node/get';

// function filterAllErrors(errors: any[]): (JSONError | Promise<JSONError | undefined>)[] {
//     return errors.filter((item) => isJsonError(item) || item instanceof Promise);
// }

export function getErrors(core: Interface, root: Node, pointer: JSONPointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
    }

    const errors: (JSONError | Promise<JSONError | undefined>)[] = core
        .validate(json(startNode), startNode.schema, startNode.pointer)
        .flat(Infinity);

    return errors.filter((item) => isJsonError(item) || item instanceof Promise);
}

export function splitErrors(
    errors: (JSONError | Promise<JSONError | undefined>)[]
): [JSONError[], Promise<JSONError[]>[]] {
    const syncErrors: JSONError[] = [];
    const asyncErrors: Promise<JSONError[]>[] = [];
    for (let i = 0, l = errors.length; i < l; i += 1) {
        if (isJsonError(errors[i])) {
            syncErrors.push(errors[i] as JSONError);
        } else if (errors[i] instanceof Promise) {
            // @ts-ignore
            asyncErrors.push(errors[i]);
        }
    }
    return [syncErrors, asyncErrors];
}
