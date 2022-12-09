import { isJSONError, isNode } from '../../types';
import { create } from '../../node/create';
import { invalidPathError } from '../../errors';
import { getSchemaOfChild } from './getSchemaOfChild';
function isNumber(value) {
    return `${parseInt(value)}` === value;
}
/**
 * creates a new child node for the given property. Expects that no child node
 * is present at 'property'
 */
export function createChildNode(draft, node, property, value) {
    if (node.type === 'array' && !isNumber(property)) {
        return invalidPathError({
            pointer: node.pointer,
            reason: `child property '${property}' to array is not a number`,
            where: 'resolving target node in transform.set'
        });
    }
    const schema = getSchemaOfChild(draft, node, property, value);
    if (isJSONError(schema)) {
        return schema;
    }
    const changeSet = [];
    const childIndex = node.type === 'object' ? node.children.length : property;
    if (isNode(node.children[childIndex])) {
        changeSet.push({ type: 'delete', node: node.children[childIndex] });
    }
    node.children[childIndex] = create(draft, value, schema, `${node.pointer}/${property}`);
    // @change create node
    changeSet.push({ type: 'create', node: node.children[childIndex] });
    return changeSet;
}
//# sourceMappingURL=createChildNode.js.map