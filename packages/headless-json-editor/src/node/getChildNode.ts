import { Node, isParentNode } from './types';

/**
 * returns child item or property if found
 */
export function getChildNode(node: Node, property: string) {
    if (isParentNode(node)) {
        return node.children.find((node) => node.property === property);
    }
    return undefined;
}

export function getChildNodeIndex(node: Node, property: string) {
    if (isParentNode(node)) {
        return node.children.findIndex((node) => node.property === property);
    }
    return -1;
}
