import { JsonPointer, JsonError } from 'json-schema-library';
import { isParentNode, Node } from '../types';
import { getChildIndex } from '../node/getChildNode';
import { split, join } from '@sagold/json-pointer';
import { getData } from '../node/getData';

export function buildPathsMap(paths: (JsonPointer | string[])[]) {
    const map: Record<string, unknown> = {};
    paths.forEach((p) => {
        const frags = split(p);
        let currentLocation = map;
        for (let i = 0, l = frags.length; i < l; i += 1) {
            const property = frags[i];
            currentLocation[property] = currentLocation[property] || {};
            currentLocation = currentLocation[property] as Record<string, unknown>;
        }
        currentLocation.$return = true;
    });
    return map;
}

export function unlinkMap(): never {
    throw new Error('not implemented');
}

/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export function unlinkPaths(): never {
    throw new Error('not implemented');
}

/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export function unlinkPath<T extends Node = Node>(
    previousRoot: T,
    pointer: JsonPointer | string[]
): JsonError | [T, Node] {
    pointer = join(pointer as JsonPointer);
    if (!isParentNode(previousRoot)) {
        return previousRoot.schemaNode.createError('invalid-node-type-error', {
            pointer,
            schema: previousRoot.schema,
            value: getData(previousRoot),
            expectedType: 'array or object',
            type: previousRoot?.type,
            reason: `root node must be of type array or object or else there is nothing to delete`,
            where: `transform: 'remove' data at '${pointer}'`
        });
    }

    const frags: string[] = split(pointer);
    const nextRoot = { ...previousRoot };
    let targetNode: Node = nextRoot;

    while (frags.length > 0) {
        const childProperty = frags.shift() as string;
        const childIndex = getChildIndex(targetNode, childProperty);
        if (!isParentNode(targetNode) || childIndex < 0) {
            return previousRoot.schemaNode.createError('invalid-path-error', {
                pointer,
                schema: targetNode.schema,
                value: getData(targetNode),
                reason: `path does not lead to valid destination in data/tree at ${targetNode.pointer}`,
                where: `transform: 'remove' data at '${pointer}'`
            });
        }
        // unlink next node
        const nextNode: Node = { ...targetNode.children[childIndex] };
        // unlink current childlist
        targetNode.children = [...targetNode.children];
        // unlink next node in children
        targetNode.children[childIndex] = nextNode;
        // move to next node
        targetNode = nextNode;
    }

    // targetNode is unlinked, its children are not
    return [nextRoot, targetNode];
}
