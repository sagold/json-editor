import { JSONPointer, JSONError } from 'json-schema-library';
import { ObjectNode, ArrayNode, isParentNode, Node } from '../node/types';
import { invalidPathError, invalidNodeTypeError } from '../errors';
import { getChildNodeIndex } from '../node/getChildNode';
import { split, join } from 'gson-pointer';

export function buildPathsMap(paths: (JSONPointer | string[])[]) {
    const map: { [p: string]: any } = {};
    paths.forEach((p) => {
        const frags = split(p);
        let currentLocation = map;
        for (let i = 0, l = frags.length; i < l; i += 1) {
            const property = frags[i];
            currentLocation[property] = currentLocation[property] || {};
            currentLocation = currentLocation[property];
        }
        currentLocation.$return = true;
    });
    return map;
}

export function unlinkMap(previousRoot: Node, map: { [p: string]: any }) {
    throw new Error('not implemented');
}

/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export function unlinkPaths(previousRoot: Node, paths: JSONPointer[]) {
    throw new Error('not implemented');
}

/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export function unlinkPath(
    previousRoot: Node,
    pointer: JSONPointer | string[]
): JSONError | [ObjectNode | ArrayNode, Node] {
    pointer = join(pointer);
    if (!isParentNode(previousRoot)) {
        return invalidNodeTypeError({
            pointer,
            expectedType: 'array or object',
            type: previousRoot?.type,
            reason: `root node must be of type array or object or else there is nothing to delete`,
            where: `transform: 'remove' data at '${pointer}'`
        });
    }

    const frags: string[] = split(pointer);
    const nextRoot = { ...previousRoot };
    let targetNode: Node = nextRoot;
    let childIndex = -1;
    let childProperty: string;

    while (frags.length > 0) {
        childProperty = frags.shift() as string;
        childIndex = getChildNodeIndex(targetNode, childProperty);
        if (!isParentNode(targetNode) || childIndex < 0) {
            return invalidPathError({
                pointer,
                reason: `path does not lead to valid destination in data/tree at ${targetNode.pointer}`,
                where: `transform: 'remove' data at '${pointer}'`
            });
        }
        // unlink next node
        const nextNode = { ...targetNode.children[childIndex] };
        // unlink current childlist
        targetNode.children = [...targetNode.children];
        // unlink next node in children
        targetNode.children[childIndex] = nextNode;
        targetNode = nextNode;
    }

    // targetNode is unlinked, its children are not
    return [nextRoot, targetNode];
}
