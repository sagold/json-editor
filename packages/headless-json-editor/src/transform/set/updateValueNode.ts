import { ValueNode, isJsonError, ParentNode, isNode, Change, FileNode } from '../../types';
import { _createNode } from '../../node/createNode';
import { getChildIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';

/**
 * updates or replaces value node
 *
 * @param parent - parentNode to 'child'
 */
export function updateValueNode(parent: ParentNode, child: ValueNode | FileNode, value: any) {
    // console.log('update', child.pointer, value);
    const targetIndex = getChildIndex(parent, child.property);
    const changeSet: Change[] = [];
    if (typeof child.value === typeof value) {
        const newChild = { ...child };
        parent.children[targetIndex] = newChild;
        // @change update node
        newChild.value = value;
        changeSet.push({ type: 'update', node: newChild });
        return changeSet;
    }

    const schemaNode = getSchemaOfChild(parent, child.property, value);
    if (isJsonError(schemaNode)) {
        return schemaNode;
    }

    if (schemaNode === undefined) {
        return parent.schemaNode.createError('schema-warning', {
            schema: child.schema,
            pointer: child.pointer,
            value
        });
    }

    if (deepEqual(schemaNode.schema, child.schema)) {
        const newChild = { ...child };
        parent.children[targetIndex] = newChild;
        // @change update node
        newChild.value = value;
        changeSet.push({ type: 'update', node: newChild });
        return changeSet;
    }

    // const childPointer = `${parent.pointer}/${child.property}`;
    if (isNode(parent.children[targetIndex])) {
        // @change replace node
        changeSet.push({ type: 'delete', node: parent.children[targetIndex] });
    }
    parent.children[targetIndex] = _createNode(schemaNode, value, child.pointer, parent.type === 'array');
    changeSet.push({ type: 'create', node: parent.children[targetIndex] });
    return changeSet;
}
