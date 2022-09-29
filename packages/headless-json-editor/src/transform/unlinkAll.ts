import { Node, isParentNode } from '../types';

/**
 * Returns a clone of the node. Each node is a shallow clone so do not modify
 * arrays or objetcs directly, expect for children
 *
 * @returns deep clone of node
 */
export function unlinkAll(node: Node) {
    const newNode = { ...node };
    if (isParentNode(newNode)) {
        newNode.children = newNode.children.map((n) => unlinkAll(n));
    }
    return newNode;
}
