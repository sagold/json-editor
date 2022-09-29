import { Node } from './types';

/**
 * reduces a schema tree to its contained json data
 */
export function json(node: Node) {
    if (node == null) {
        return null;
    }
    if (node.type === 'array') {
        return node.children.map(json);
    }
    if (node.type === 'object') {
        const obj = {};
        node.children.forEach((child) => (obj[child.property] = json(child)));
        return obj;
    }
    return node.value;
}
