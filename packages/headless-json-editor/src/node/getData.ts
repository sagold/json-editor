import { Node } from '../types';

/**
 * reduces a schema tree to its contained json data
 */
export function getData(node: Node): unknown {
    if (node == null) {
        return null;
    }
    if (node.type === 'array') {
        return node.children.map(getData);
    }
    if (node.type === 'object') {
        const obj: Record<string, unknown> = {};
        node.children.forEach((child) => (obj[child.property] = getData(child)));
        return obj;
    }
    return node.value;
}
