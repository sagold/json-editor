import { DataNode, isParentNode } from '../types';

/**
 * returns all nodes in the tree as a flat list
 */
export function getNodeList(node: DataNode, list: DataNode[] = []): DataNode[] {
    list.push(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => getNodeList(child, list));
    }
    return list;
}
