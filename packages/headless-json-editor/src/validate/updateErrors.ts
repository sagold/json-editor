import { JsonError } from 'json-schema-library';
import { Node, isParentNode } from '../types';
import { getData } from '../node/getData';
import { getNode } from '../node/getNode';

function each(node: Node, cb: (node: Node) => void) {
    cb(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => each(child, cb));
    }
}

/**
 * Perform json-schema validation and assign errors to corresponding nodes
 */
export async function updateErrors(node: Node) {
    const pointerToErrors: Record<string, JsonError[]> = {};
    // reset errors
    each(node, (n) => {
        n.errors = [];
        pointerToErrors[n.pointer] = n.errors;
    });

    // retrieve errors
    const { errors, errorsAsync } = node.schemaNode.validate(getData(node), node.pointer);

    // assign errors
    errors.forEach((err: JsonError) => {
        const pointer = err.data?.pointer ?? '#';
        if (pointerToErrors[pointer] == null) {
            // retrieve new (dynamic) node
            const n = getNode(node, pointer) as Node; // @todo ignoring possible JsonError
            pointerToErrors[pointer] = n.errors;
        }
        pointerToErrors[pointer].push(err);
    });

    if (errorsAsync.length > 0) {
        const errors = await Promise.all(errorsAsync);
        return errors.filter((err) => {
            if (err) {
                const pointer = err.data?.pointer ?? '#';
                // schema may change
                pointerToErrors[pointer] = pointerToErrors[pointer] ?? [];
                pointerToErrors[pointer].push(err);
                return true;
            }
            return false;
        });
    }

    return undefined;
}
