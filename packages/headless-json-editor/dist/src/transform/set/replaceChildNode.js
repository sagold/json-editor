import { isJSONError } from '../../types';
import { create } from '../../node/create';
import { getChildNodeIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';
/**
 * replaces child node in given parent node
 */
export function replaceChildNode(core, parent, child, value) {
    var _a;
    const schema = getSchemaOfChild(core, parent, child.property, value);
    if (isJSONError(schema)) {
        return schema;
    }
    const changeSet = [];
    const targetIndex = getChildNodeIndex(parent, child.property);
    const nextNode = create(core, value, schema, child.pointer);
    // replace change - @todo sync old subtree with new subtree
    parent.children[targetIndex] = nextNode;
    if (nextNode.type === child.type) {
        // reuse parent if the type has not changeda
        // currently this keeps modals stable that modify the current object (EditJsonModal)
        nextNode.id = child.id;
    }
    if (!deepEqual(child.schema, nextNode.schema)) {
        // @change replace node
        changeSet.push({ type: 'delete', node: child });
        changeSet.push({ type: 'create', node: nextNode });
        return changeSet;
    }
    // @change update parent, replace children
    changeSet.push({ type: 'update', node: nextNode });
    child.children.forEach((childNode) => changeSet.push({ type: 'delete', node: childNode }));
    // @todo why can next node be missing children?
    (_a = nextNode.children) === null || _a === void 0 ? void 0 : _a.forEach((childNode) => changeSet.push({ type: 'create', node: childNode }));
    return changeSet;
}
//# sourceMappingURL=replaceChildNode.js.map