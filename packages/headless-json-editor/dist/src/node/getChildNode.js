import { isParentNode } from '../types';
/**
 * returns child item or property if found
 */
export function getChildNode(node, property) {
    if (isParentNode(node)) {
        return node.children.find((node) => node.property === property);
    }
    return undefined;
}
export function getChildNodeIndex(node, property) {
    if (isParentNode(node)) {
        return node.children.findIndex((node) => node.property === property);
    }
    return -1;
}
//# sourceMappingURL=getChildNode.js.map