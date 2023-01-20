import { Draft } from 'json-schema-library';
import { isJSONError, ParentNode, Change, isNode } from '../../types';
import { create } from '../../node/create';
import { invalidPathError } from '../../errors';
import { getSchemaOfChild } from './getSchemaOfChild';
import { json } from '../../node/json';

function isNumber(value: string) {
    return `${parseInt(value)}` === value;
}

/**
 * creates a new child node for the given property. Expects that no child node
 * is present at 'property'
 */
export function createChildNode(draft: Draft, node: ParentNode, property: string, value: unknown) {
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

    const changeSet: Change[] = [];
    const childIndex = node.type === 'object' ? node.children.length : (property as unknown as number);
    if (isNode(node.children[childIndex])) {
        changeSet.push({ type: 'delete', node: node.children[childIndex] });
    }
    node.children[childIndex] = create(draft, value, schema, `${node.pointer}/${property}`, node.type === 'array');
    // @change create node
    changeSet.push({ type: 'create', node: node.children[childIndex] });

    if (node.type === 'object') {
        // update optional properties
        node.missingProperties = node.missingProperties.filter((prop) => prop !== property);
        changeSet.unshift({ type: 'update', node: node });
    }

    return changeSet;
}
