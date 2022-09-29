import { Draft } from 'json-schema-library';
import { isJSONError, ParentNode, Change } from '../../types';
import { create } from '../../node/create';
import { getChildNodeIndex } from '../../node/getChildNode';
import { deepEqual } from 'fast-equals';
import { getSchemaOfChild } from './getSchemaOfChild';

/**
 * replaces child node in given parent node
 */
export function replaceChildNode(core: Draft, parent: ParentNode, child: ParentNode, value: unknown) {
    const schema = getSchemaOfChild(core, parent, child.property, value);
    if (isJSONError(schema)) {
        return schema;
    }

    const changeSet: Change[] = [];
    const targetIndex = getChildNodeIndex(parent, child.property);
    const nextNode = create<ParentNode>(core, value, schema, child.pointer);
    // replace change - @todo sync old subtree with new subtree
    parent.children[targetIndex] = nextNode;

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
    nextNode.children?.forEach((childNode) => changeSet.push({ type: 'create', node: childNode }));
    return changeSet;
}
