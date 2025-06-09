import gp, { split, join } from '@sagold/json-pointer';
import { createChildNode } from './set/createChildNode';
import { createNode } from '../node/createNode';
import { deepEqual } from 'fast-equals';
import { JsonPointer, JsonError, isReduceable, SchemaNode } from 'json-schema-library';
import { getChildIndex } from '../node/getChildNode';
import { getData } from '../node/getData';
import { Node, isValueNode, isParentNode, isJsonError, ParentNode, Change, isFileNode } from '../types';
import { replaceChildNode } from './set/replaceChildNode';
import { syncNodes } from './set/syncNodes';
import { updateValueNode } from './set/updateValueNode';

function schemaHasChanged(a?: SchemaNode, b?: SchemaNode) {
    return (
        // @todo @10 we should be able to rely on dynamicId only, omitting deepEqual
        (a?.dynamicId ?? a?.schemaLocation) !== (b?.dynamicId ?? b?.schemaLocation) || !deepEqual(a?.schema, b?.schema)
    );
}

export type SetValueReturnType<T> = [JsonError] | [T, Change[]];

/**
 * Set a value at pointer-location
 * @returns new node-tree with a list of changes applied or an error
 */
export function setValue<T extends Node = Node>(node: T, pointer: JsonPointer, value: any): SetValueReturnType<T> {
    /** path to target */
    const path = split(pointer);
    /** list of changes on nodes while performing set operation */
    const changeSet: Change[] = [];

    // if change on root, replace all, but reuse root-id
    if (path.length === 0 || !isParentNode(node)) {
        const newRoot = createNode<T>(node.schemaNode, value);
        changeSet.push({ type: 'delete', node: node });
        changeSet.push({ type: 'create', node: newRoot });
        newRoot.id = node.id;
        return [newRoot, changeSet];
    }

    if (isReduceable(node.schemaNode)) {
        const schemaNode = node.schemaNode;
        // root node has a dynamic schema which may change based on our new value,
        // thus we must recreate and test the tree for schema changes
        const currentData = getData(node);
        const { node: currentSN } = schemaNode.reduceNode(currentData);

        const nextData = gp.set(currentData, pointer, value);
        const { node: nextSN } = schemaNode.reduceNode(nextData);

        if (schemaHasChanged(currentSN, nextSN)) {
            // @todo fullNextData might be redundant
            const fullNextData = schemaNode.getData(nextData, { addOptionalProps: false });
            const newRoot = createNode<T>(schemaNode, fullNextData);
            changeSet.push({ type: 'delete', node: node });
            changeSet.push({ type: 'create', node: newRoot });
            newRoot.id = node.id;
            syncNodes(node, newRoot);
            return [newRoot, changeSet];
        }
    }

    // unlink tree and follow path to value
    const newRoot = { ...node };
    const error = setNext(newRoot, path, value, changeSet);
    if (error) {
        return [error];
    }

    return [newRoot, changeSet];
}

/**
 * @param parentNode - unlinked parent node which will be modified
 */
function setNext(parentNode: ParentNode, path: string[], value: unknown, changeSet: Change[]): JsonError | undefined {
    const property = path.shift();

    if (property == null) {
        throw new Error(`Invalid property: '${property}'`);
    }

    const childNodeIndex = getChildIndex(parentNode, property);

    if (childNodeIndex === -1 && path.length > 0) {
        parentNode.schemaNode.createError('invalid-path-error', {
            pointer: join(parentNode.pointer, property, ...path),
            value,
            schema: parentNode?.schema,
            reason: `no node found at '${parentNode.pointer}/${property}'`,
            where: 'resolving json pointer to node in `set`'
        });
    }

    // children will be modified - unlink them
    parentNode.children = [...parentNode.children];

    if (childNodeIndex === -1) {
        // CREATE & INSERT new child
        const result = createChildNode(parentNode, property, value);
        if (isJsonError(result)) {
            return result;
        }
        changeSet.push(...result);
        return;
    }

    const childNode = parentNode.children[childNodeIndex];
    if (path.length === 0) {
        // UPDATE target node's value
        if (isValueNode(childNode) || isFileNode(childNode)) {
            const changesOrError = updateValueNode(parentNode, childNode, value);
            if (isJsonError(changesOrError)) {
                return changesOrError;
            }
            changeSet.push(...changesOrError);
            return;
        }
        // REPLACE node, creating new object or array tree
        if (isParentNode(childNode)) {
            // @todo further diff schema and check for specific changes (sync)
            const changesOrError = replaceChildNode(parentNode, childNode, value);
            if (isJsonError(changesOrError)) {
                return changesOrError;
            }
            changeSet.push(...changesOrError);
            return;
        }
        throw new Error('Invalid state in transform.set');
    }

    if (!isParentNode(childNode)) {
        parentNode.schemaNode.createError('invalid-path-error', {
            pointer: join(parentNode.pointer, property, ...path),
            value: getData(childNode),
            schema: childNode.schema,
            reason: 'expected parent data to be object or array',
            where: 'resolving json pointer to node in transform.change'
        });
    }

    if (isReduceable(childNode.schemaNode)) {
        const schemaNode = childNode.schemaNode;
        // child node has a dynamic schema which may change based in new value,
        // thus we must test recreate sub tree if schema differs
        const currentData = getData(childNode);
        const { node: currentSN } = schemaNode.reduceNode(currentData);

        const nextData = gp.set(getData(childNode), join(path), value);
        const { node: nextSN } = schemaNode.reduceNode(nextData);

        if (schemaHasChanged(currentSN, nextSN)) {
            // @todo further diff schema and check for specific changes (sync)
            const newChild = createNode(schemaNode, nextData, childNode.pointer, parentNode.type === 'array');
            changeSet.push({ type: 'delete', node: childNode });
            changeSet.push({ type: 'create', node: newChild });
            newChild.id = childNode.id;
            parentNode.children[childNodeIndex] = newChild;
            syncNodes(childNode, newChild);
            return;
        }
    }

    const nextNode = { ...childNode } as ParentNode;
    parentNode.children[childNodeIndex] = nextNode;
    return setNext(nextNode, path, value, changeSet);
}
