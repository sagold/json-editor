import { Node, isParentNode } from '../types';

/**
 * returns child item or property if found
 */
export function getChildNode(node: Node, property: string) {
    if (isParentNode(node)) {
        return node.children.find((node) => node.property === property);
    }
    return undefined;
}

/**
 * @returns index of child node identified by property or -1
 */
export function getChildIndex(node: Node, property: string) {
    if (isParentNode(node)) {
        return node.children.findIndex((node) => node.property === property);
    }
    return -1;
}
