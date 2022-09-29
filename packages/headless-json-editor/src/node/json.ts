import { Node } from '../types';

/**
 * reduces a schema tree to its contained json data
 */
export function json(node: Node): unknown {
    if (node == null) {
        return null;
    }
    if (node.type === 'array') {
        return node.children.map(json);
    }
    if (node.type === 'object') {
        const obj: Record<string, unknown> = {};
        node.children.forEach((child) => (obj[child.property] = json(child)));
        return obj;
    }
    return node.value;
}
