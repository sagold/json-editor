import { isJSONError } from '../types';
import gp from 'gson-pointer';
import { invalidPathError } from '../errors';
import { updatePath } from './updatePath';
import { unlinkPath } from './unlinkPath';
/**
 * move array item to another index
 */
export function move(core, rootNode, pointerToArray, from, to) {
    const result = unlinkPath(rootNode, pointerToArray);
    if (isJSONError(result)) {
        return [result];
    }
    const [newRoot, arrayNode] = result;
    if (arrayNode.type !== 'array') {
        return [
            invalidPathError({
                pointer: pointerToArray,
                reason: `expected pointer to array, received ${arrayNode.type}`,
                where: 'retrieving array in transform.insert'
            })
        ];
    }
    to = Math.min(to, arrayNode.children.length - 1);
    from = Math.min(from, arrayNode.children.length - 1);
    const list = [...arrayNode.children];
    list.splice(to, 0, list.splice(from, 1)[0]);
    arrayNode.children = list;
    // update changed nodes
    const changes = [];
    const start = Math.min(from, to);
    const end = Math.max(from, to);
    for (let i = start; i <= end; i += 1) {
        list[i] = updatePath(list[i], gp.join(pointerToArray), `${i}`);
        changes.push({ type: 'update', node: list[i] });
    }
    return [newRoot, changes];
}
//# sourceMappingURL=move.js.map