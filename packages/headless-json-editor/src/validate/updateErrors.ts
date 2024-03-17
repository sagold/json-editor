import { Draft, JsonError } from 'json-schema-library';
import { Node, isParentNode } from '../types';
import { getData } from '../node/getData';
import { getNode } from '../node/getNode';
import { splitErrors } from './validateNode';

function each(node: Node, cb: (node: Node) => void) {
    cb(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => each(child, cb));
    }
}

/**
 * Perform json-schema validation and assign errors to corresponding nodes
 */
export async function updateErrors(draft: Draft, node: Node) {
    const pointerToErrors: Record<string, JsonError[]> = {};
    // reset errors
    each(node, (n) => {
        n.errors = [];
        pointerToErrors[n.pointer] = n.errors;
    });

    // retrieve errors
    const errors = draft.validate(getData(node), node.schema, node.pointer).flat(Infinity);
    const [syncErrors, asyncErrors] = splitErrors(errors);

    // assign errors
    syncErrors.forEach((err: JsonError) => {
        const pointer = err.data?.pointer ?? '#';
        if (pointerToErrors[pointer] == null) {
            // retrieve new (dynamic) node
            const n = getNode(node, pointer) as Node; // @todo ignoring possible JsonError
            pointerToErrors[pointer] = n.errors;
        }
        pointerToErrors[pointer].push(err);
    });

    // await and assign async errors
    asyncErrors.forEach((validation: Promise<JsonError | undefined>) =>
        validation.then((err) => {
            if (err == null) {
                return;
            }
            const pointer = err.data?.pointer ?? '#';
            // schema may change
            pointerToErrors[pointer] = pointerToErrors[pointer] ?? [];
            pointerToErrors[pointer].push(err);
        })
    );

    return Promise.all(asyncErrors);
}
