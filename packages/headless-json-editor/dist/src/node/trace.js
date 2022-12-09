import { getChildNode } from './getChildNode';
import { split } from 'gson-pointer';
/**
 * returns all nodes along the path, including the given starting node
 */
export function trace(node, pointer) {
    const frags = split(pointer).reverse();
    const selection = [node];
    let currentNode = node;
    while (frags.length) {
        const property = frags.pop();
        const nextNode = getChildNode(currentNode, property);
        if (nextNode === undefined) {
            return selection;
        }
        currentNode = nextNode;
        selection.push(currentNode);
    }
    return selection;
}
//# sourceMappingURL=trace.js.map