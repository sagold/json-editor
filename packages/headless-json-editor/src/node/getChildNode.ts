import { DataNode, isParentNode } from '../types';

/**
 * returns child item or property if found
 */
export function getChildNode(node: DataNode, property: string) {
    if (isParentNode(node)) {
        return node.children.find((node) => node.property === property);
    }
    return undefined;
}

/**
 * @returns index of child node identified by property or -1
 */
export function getChildIndex(node: DataNode, property: string) {
    if (isParentNode(node)) {
        return node.children.findIndex((node) => node.property === property);
    }
    return -1;
}
