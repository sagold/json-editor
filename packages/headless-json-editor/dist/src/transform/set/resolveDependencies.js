import { create } from '../../node/create';
import { join } from 'gson-pointer';
import { getChildNodeIndex, getChildNode } from '../../node/getChildNode';
import { getUpdatedData } from './getUpdatedData';
/**
 * resolves schema containing dependencies. will modifiy input 'node' by changed
 * schema.
 *
 * @returns possibly changed input node and list of changes
 */
export function resolveDependencies(draft, node, pointerToValue, value) {
    const changeSet = [];
    // replace whole object and reuse currently edited node
    if (!node.schema.dependencies) {
        return [node, changeSet];
    }
    // @todo improve diff
    // if next key is a key in dependencies, recreate whole node and
    // let `create` do the complex work
    const changedProperty = pointerToValue[0];
    const dependencyAffected = node.schema.dependencies[changedProperty] != null;
    if (!dependencyAffected) {
        return [node, changeSet];
    }
    // store current edited child for later, we have to reuse it
    const currentlyEditedChild = getChildNode(node, pointerToValue[0]);
    if (currentlyEditedChild === undefined) {
        throw new Error(`currently edited child '${node.pointer}/${pointerToValue[0]}' could not be resolved on transform.set`);
    }
    // rebuild this object with updated data
    const currentData = getUpdatedData(node, join(pointerToValue), value);
    // @change delete node
    changeSet.push({ type: 'delete', node: node });
    // note: we may not replace edited child, but must update it
    const newNode = create(draft, currentData, node.schema, node.pointer);
    // @change create node
    changeSet.push({ type: 'create', node: newNode });
    const nextChildIndex = getChildNodeIndex(newNode, pointerToValue[0]);
    newNode.children[nextChildIndex] = currentlyEditedChild;
    node.children = newNode.children;
    return [node, changeSet];
}
//# sourceMappingURL=resolveDependencies.js.map