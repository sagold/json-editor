import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node, isJSONError, isParentNode } from '../types';
import { json } from '../node/json';
import { get } from '../node/get';
import { splitErrors } from './getErrors';

function each(node: Node, cb: (node: Node) => void) {
    cb(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => each(child, cb));
    }
}

function filterErrors(errors: JSONError[]): JSONError[] {
    return [errors].flat(Infinity).filter(isJSONError);
}

/**
 * perform validation and assign errors to corresponding nodes
 */
export async function updateErrors(draft: Draft, root: Node, pointer: JSONPointer = '#') {
    let startNode = get(root, pointer);
    if (startNode.type === 'error') {
        startNode = root;
    }

    const pointerToErrors: Record<string, JSONError[]> = {};
    // reset errors
    each(startNode, (node) => {
        node.errors = [];
        pointerToErrors[node.pointer] = node.errors;
    });

    // retrieve errors
    const errors = draft.validate(json(startNode), startNode.schema, startNode.pointer).flat(Infinity);
    const [syncErrors, asyncErrors] = splitErrors(errors);

    // assign errors
    syncErrors.forEach((err: JSONError) => {
        const pointer = err.data?.pointer ?? '#';
        if (pointerToErrors[pointer] == null) {
            // retrieve new (dynamic) node
            pointerToErrors[pointer] = get(root, pointer).errors;
        }
        pointerToErrors[pointer].push(err);
    });

    // await and assign async errors
    asyncErrors.forEach((validation: Promise<JSONError[]>) =>
        validation.then((errors) => {
            // console.log(errors);
            filterErrors(errors).forEach((err) => {
                const pointer = err.data?.pointer ?? '#';
                // schema may change
                pointerToErrors[pointer] = pointerToErrors[pointer] ?? [];
                pointerToErrors[pointer].push(err);
            });
        })
    );

    return Promise.all(asyncErrors);
}
