import { Draft, JsonPointer, JsonError } from 'json-schema-library';
import { Node, isJsonError, isParentNode } from '../types';
import { getData } from '../node/getData';
import { get } from '../node/get';
import { splitErrors } from './getErrors';

function each(node: Node, cb: (node: Node) => void) {
    cb(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => each(child, cb));
    }
}

function filterErrors(errors: JsonError[]): JsonError[] {
    return [errors].flat(Infinity).filter(isJsonError);
}

/**
 * perform validation and assign errors to corresponding nodes
 */
export async function updateErrors(draft: Draft, root: Node, pointer: JsonPointer = '#') {
    const startNode = get(root, pointer);
    if (startNode.type === 'error') {
        console.error(`Invalid pointer: '${pointer}' to validate - abort`);
        return;
    }

    const pointerToErrors: Record<string, JsonError[]> = {};
    // reset errors
    each(startNode, (node) => {
        node.errors = [];
        pointerToErrors[node.pointer] = node.errors;
    });

    // retrieve errors
    const errors = draft.validate(getData(startNode), startNode.schema, startNode.pointer).flat(Infinity);
    const [syncErrors, asyncErrors] = splitErrors(errors);

    // assign errors
    syncErrors.forEach((err: JsonError) => {
        const pointer = err.data?.pointer ?? '#';
        if (pointerToErrors[pointer] == null) {
            // retrieve new (dynamic) node
            const node = get(root, pointer) as Node; // @todo ignoring possible JsonError
            pointerToErrors[pointer] = node.errors;
        }
        pointerToErrors[pointer].push(err);
    });

    // await and assign async errors
    asyncErrors.forEach((validation: Promise<JsonError[]>) =>
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
