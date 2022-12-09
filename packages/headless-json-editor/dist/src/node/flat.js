import { isParentNode } from '../types';
/**
 * returns all nodes in the tree as a flat list
 */
export function flat(node, list = []) {
    list.push(node);
    if (isParentNode(node)) {
        node.children.forEach((child) => flat(child, list));
    }
    return list;
}
//# sourceMappingURL=flat.js.map