import { Node, isParentNode } from '../types';

/**
 * returns all nodes in the tree as a flat list
 */
export function getNodeList(node: Node, list: Node[] = []): Node[] {
    list.push(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => getNodeList(child, list));
    }
    return list;
}
