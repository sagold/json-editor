import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node, isJSONError, isParentNode } from '../node/types';
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
export async function validate(draft: Draft, root: Node, pointer: JSONPointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        return startNode;
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
    // console.log('syncErrors', syncErrors);

    // assign errors
    syncErrors.forEach((err: JSONError) => {
        const pointer = err.data?.pointer ?? '#';
        pointerToErrors[pointer].push(err);
    });

    // await and assign async errors
    asyncErrors.forEach((validation: Promise<JSONError[]>) =>
        validation.then((errors) => {
            // console.log(errors);
            filterErrors(errors).forEach((err) => {
                const pointer = err.data?.pointer ?? '#';
                pointerToErrors[pointer].push(err);
            });
        })
    );

    return Promise.all(asyncErrors);
}
