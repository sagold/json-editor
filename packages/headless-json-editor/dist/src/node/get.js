import gp from 'gson-pointer';
import { invalidPathError } from '../errors';
import { getChildNode } from './getChildNode';
/**
 * returns the node with the corresponding pointer
 */
export function get(node, pointer) {
    const frags = gp.split(pointer);
    return step(node, frags, []);
}
function step(node, frags, pointer) {
    if (frags.length === 0) {
        return node;
    }
    const prop = frags.shift();
    pointer.push(prop);
    const nextNode = getChildNode(node, prop);
    if (nextNode) {
        return step(nextNode, frags, pointer);
    }
    return invalidPathError({ pointer: gp.join(pointer) });
}
//# sourceMappingURL=get.js.map