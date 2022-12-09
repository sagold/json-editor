import { isNode } from '../../types';
import { create } from '../../node/create';
import { getChildNodeIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
/**
 * resolves an oneOf schema. It will update the given parent node with the new
 * child or return undefined if no changes were made.
 *
 * @param draft
 * @param parent - parent object or array containing oneOf definitions
 * @param property - index of child item to update
 * @param data - udpated data (next value) of parent object or array
 * @returns undefined if the schema has not changed or a list of changes if the child item was replaced
 */
export function resolveOneOf(draft, parent, property, data) {
    var _a;
    // from parent retrieve the new oneOf schema
    const nextChildSchema = draft.step(property, parent.schema, data, parent.pointer);
    let index = getChildNodeIndex(parent, property);
    if (index === -1) {
        index = parent.type === 'array' ? parseInt(property) : parent.children.length;
    }
    // abort if the child schema has not changed
    const currentChildSchema = (_a = parent.children[index]) === null || _a === void 0 ? void 0 : _a.schema;
    if (currentChildSchema != null && deepEqual(nextChildSchema, currentChildSchema)) {
        return undefined;
    }
    // @change replace node
    const changeSet = [];
    if (isNode(parent.children[index])) {
        changeSet.push({ type: 'delete', node: parent.children[index] });
    }
    const childData = Array.isArray(data) ? data[parseInt(property)] : data[property];
    parent.children = [...parent.children];
    parent.children[index] = create(draft, childData, nextChildSchema, `${parent.pointer}/${property}`);
    // @change create node
    changeSet.push({ type: 'create', node: parent.children[index] });
    return changeSet;
}
//# sourceMappingURL=resolveOneOf.js.map