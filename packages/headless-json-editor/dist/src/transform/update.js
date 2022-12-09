import { isJSONError } from '../types';
import { unlinkPath } from './unlinkPath';
/**
 * updates schema of a node
 */
export function updateSchema(rootNode, pointer, schema) {
    const result = unlinkPath(rootNode, pointer);
    if (isJSONError(result)) {
        return [result];
    }
    const [root, targetNode] = result;
    targetNode.schema = schema;
    return [root, [{ type: 'update', node: targetNode }]];
}
/**
 * updates options of a node
 */
export function updateOptions(rootNode, pointer, options) {
    const result = unlinkPath(rootNode, pointer);
    if (isJSONError(result)) {
        return [result];
    }
    const [root, targetNode] = result;
    targetNode.options = options;
    return [root, [{ type: 'update', node: targetNode }]];
}
//# sourceMappingURL=update.js.map