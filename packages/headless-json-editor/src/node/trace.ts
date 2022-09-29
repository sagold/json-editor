import { JSONPointer } from 'json-schema-library';
import { getChildNode } from './getChildNode';
import { Node } from './types';
import { split } from 'gson-pointer';

/**
 * returns all nodes along the path, including the given starting node
 */
export function trace(node: Node, pointer: JSONPointer) {
    const frags = split(pointer).reverse();
    const selection = [node];

    let currentNode: Node = node;
    while (frags.length) {
        const property = frags.pop() as string;
        // @ts-ignore
        currentNode = getChildNode(currentNode, property);
        selection.push(currentNode);
    }

    return selection;
}
