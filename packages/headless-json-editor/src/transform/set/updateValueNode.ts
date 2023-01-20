import { Draft } from 'json-schema-library';
import { ValueNode, isJSONError, ParentNode, isNode, Change } from '../../types';
import { create } from '../../node/create';
import { getChildNodeIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';

/**
 * updates or replaces value node
 *
 * @param parent - parentNode to 'child'
 */
export function updateValueNode(draft: Draft, parent: ParentNode, child: ValueNode, value: any) {
    const targetIndex = getChildNodeIndex(parent, child.property);
    const changeSet: Change[] = [];
    if (typeof child.value === typeof value) {
        const newChild = { ...child };
        parent.children[targetIndex] = newChild;
        // @change update node
        newChild.value = value;
        changeSet.push({ type: 'update', node: newChild });
        return changeSet;
    }

    const schema = getSchemaOfChild(draft, parent, child.property, value);
    if (isJSONError(schema)) {
        return schema;
    }

    if (deepEqual(schema, child.schema)) {
        const newChild = { ...child };
        parent.children[targetIndex] = newChild;
        // @change update node
        newChild.value = value;
        changeSet.push({ type: 'update', node: newChild });
        return changeSet;
    }

    const childPointer = `${parent.pointer}/${child.property}`;
    if (isNode(parent.children[targetIndex])) {
        // @change replace node
        changeSet.push({ type: 'delete', node: parent.children[targetIndex] });
    }
    parent.children[targetIndex] = create(draft, value, schema, childPointer, parent.type === 'array');
    changeSet.push({ type: 'create', node: parent.children[targetIndex] });
    return changeSet;
}
