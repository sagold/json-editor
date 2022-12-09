import { isParentNode, isJSONError } from '../types';
import { invalidPathError } from '../errors';
import { getChildNodeIndex } from '../node/getChildNode';
import { updatePath } from './updatePath';
import { split } from 'gson-pointer';
import { unlinkPath } from './unlinkPath';
export function remove(previousRoot, pointer) {
    const frags = split(pointer);
    const property = frags.pop();
    const result = unlinkPath(previousRoot, frags);
    if (isJSONError(result)) {
        return [result];
    }
    const [nextRoot, parentNode] = result;
    const removeNodeIndex = getChildNodeIndex(parentNode, property);
    if (!isParentNode(parentNode)) {
        return [
            invalidPathError({
                pointer: pointer,
                reason: `path does not lead to valid destination in data/tree at ${parentNode.pointer}`,
                where: `transform: 'remove' data at '${pointer}'`
            })
        ];
    }
    const changes = [{ type: 'delete', node: parentNode.children[removeNodeIndex] }];
    parentNode.children = [...parentNode.children];
    parentNode.children.splice(removeNodeIndex, 1);
    if (parentNode.type === 'array') {
        for (let i = removeNodeIndex, l = parentNode.children.length; i < l; i += 1) {
            parentNode.children[i] = updatePath(parentNode.children[i], parentNode.pointer, `${i}`);
        }
    }
    return [nextRoot, changes];
}
//# sourceMappingURL=remove.js.map