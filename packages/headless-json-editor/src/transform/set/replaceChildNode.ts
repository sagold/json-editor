import { isJsonError, ParentNode, Change } from '../../types';
import { _createNode } from '../../node/createNode';
import { getChildIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';
import { syncNodes } from './syncNodes';

/**
 * replaces child node in given parent node
 */
export function replaceChildNode(parent: ParentNode, child: ParentNode, value: unknown) {
    // console.log('replace', child.pointer, value);
    const schemaNode = getSchemaOfChild(parent, child.property, value);
    if (isJsonError(schemaNode)) {
        return schemaNode;
    }

    const changeSet: Change[] = [];
    const targetIndex = getChildIndex(parent, child.property);
    const nextNode = _createNode<ParentNode>(schemaNode, value, child.pointer);
    // replace change - @todo sync old subtree with new subtree
    parent.children[targetIndex] = nextNode;

    if (nextNode.type === child.type) {
        // reuse parent if the type has not changeda
        // currently this keeps modals stable that modify the current object (EditJsonModal)
        nextNode.id = child.id;
    }

    if (!deepEqual(child.schema, nextNode.schema)) {
        syncNodes(child, nextNode);
        // @change replace node
        changeSet.push({ type: 'delete', node: child });
        changeSet.push({ type: 'create', node: nextNode });
        return changeSet;
    }

    // @change update parent, replace children
    changeSet.push({ type: 'update', node: nextNode });
    child.children.forEach((childNode) => changeSet.push({ type: 'delete', node: childNode }));
    // @todo why can next node be missing children?
    nextNode.children?.forEach((childNode) => changeSet.push({ type: 'create', node: childNode }));
    return changeSet;
}
