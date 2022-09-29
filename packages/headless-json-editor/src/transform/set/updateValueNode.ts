import { Draft } from 'json-schema-library';
import { ValueNode, isJSONError, ParentNode, isNode, Change } from '../../types';
import { create } from '../../node/create';
import { getChildNodeIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';

/**
 * updates or repalces value node
 */
export function updateValueNode(draft: Draft, parent: ParentNode, child: ValueNode, value: any) {
    const targetIndex = getChildNodeIndex(parent, child.property);
    const changeSet: Change[] = [];
    if (typeof child.value === typeof value) {
        // @change update node
        child.value = value;
        changeSet.push({ type: 'update', node: child });
        return changeSet;
    }

    const schema = getSchemaOfChild(draft, parent, child.property, value);
    if (isJSONError(schema)) {
        return schema;
    }

    if (deepEqual(schema, child.schema)) {
        // @change update node
        child.value = value;
        changeSet.push({ type: 'update', node: child });
        return changeSet;
    }

    const childPointer = `${parent.pointer}/${child.property}`;
    if (isNode(parent.children[targetIndex])) {
        // @change replace node
        changeSet.push({ type: 'delete', node: parent.children[targetIndex] });
    }
    parent.children[targetIndex] = create(draft, value, schema, childPointer);
    changeSet.push({ type: 'create', node: parent.children[targetIndex] });
    return changeSet;
}
