import { Draft } from 'json-schema-library';
import { isJsonError, ParentNode, Change, isNode } from '../../types';
import { createNode } from '../../node/createNode';
import { invalidPathError } from '../../errors';
import { getSchemaOfChild } from './getSchemaOfChild';
import { json } from '../../node/json';

function isNumber(value: string) {
    return `${parseInt(value)}` === value;
}

/**
 * creates a new child node for the given property. Expects that no child node
 * is present at 'property' and that children-array of node is already unlinked
 */
export function createChildNode(draft: Draft, node: ParentNode, property: string, value: unknown) {
    if (node.type === 'array' && !isNumber(property)) {
        return invalidPathError({
            pointer: node.pointer,
            schema: node.schema,
            value: json(node),
            property,
            reason: `child property '${property}' to array is not a number`,
            where: 'resolving target node in transform.set'
        });
    }

    const schema = getSchemaOfChild(draft, node, property, value);
    if (isJsonError(schema)) {
        return schema;
    }

    const changeSet: Change[] = [];
    const childIndex = node.type === 'object' ? node.children.length : (property as unknown as number);
    if (isNode(node.children[childIndex])) {
        changeSet.push({ type: 'delete', node: node.children[childIndex] });
    }

    const newNode = createNode(draft, value, schema, `${node.pointer}/${property}`, node.type === 'array');
    // @change create node
    changeSet.push({ type: 'create', node: newNode });

    if (node.type === 'object') {
        // update optional properties
        node.missingProperties = node.missingProperties.filter((prop) => prop !== property);
        // insert child at correct position
        const list = node.schema.properties ? Object.keys(node.schema.properties) : node.optionalProperties;
        const index = list.indexOf(newNode.property);
        if (index === -1) {
            node.children[childIndex] = newNode;
        } else {
            node.children.splice(index, 0, newNode);
        }

        changeSet.unshift({ type: 'update', node: node });
    } else {
        node.children[childIndex] = newNode;
    }

    return changeSet;
}
