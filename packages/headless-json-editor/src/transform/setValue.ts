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

/**
 * sets given value of the specified node and returns a new (shallow) node-tree
 * @returns error or new node-tree with a list of changes applied
 */
export function setValue<T extends Node = Node>(ast: T, pointer: JsonPointer, value: any): [JsonError] | [T, Change[]] {
    /** steps to value */
    const frags = split(pointer);
    /** list of changes on nodes while performing set operation */
    const changeSet: Change[] = [];

    // if change on root, replace all, but reuse root-id
    if (frags.length === 0 || !isParentNode(ast)) {
        const newAst = createNode<T>(ast.schemaNode.getNodeRoot(), value);
        changeSet.push({ type: 'delete', node: ast });
        changeSet.push({ type: 'create', node: newAst });
        newAst.id = ast.id;
        return [newAst, changeSet];
    }

    const currentRootNode = ast.schemaNode;
    if (isReduceable(currentRootNode)) {
        // root node has a dynamic schema which may change based on our new value,
        // thus we must test recreate sub tree if schema differs
        const currentData = getData(ast);
        const { node: currentNode } = currentRootNode.reduceNode(currentData);

        const nextData = gp.set(currentData, pointer, value);
        const { node: nextNode } = currentRootNode.reduceNode(nextData);

        if (schemaHasChanged(currentNode, nextNode)) {
            const fullNextData = currentRootNode.getData(nextData, { addOptionalProps: false });
            const newAst = createNode<T>(currentRootNode, fullNextData);
            changeSet.push({ type: 'delete', node: ast });
            changeSet.push({ type: 'create', node: newAst });
            newAst.id = ast.id;
            syncNodes(ast, newAst);
            return [newAst, changeSet];
        }
    }

    // unlink tree and follow path to value
    const newAst = { ...ast };
    const error = setNext(newAst, frags, frags.shift() as string, value, changeSet);
    if (error) {
        return [error];
    }

    return [newAst, changeSet];
}

/**
 * @param parentNode - unlinked parent node which will be modified
 */
function setNext(
    parentNode: ParentNode,
    frags: string[],
    property: string,
    value: unknown,
    changeSet: Change[]
): JsonError | undefined {
    if (property == null || property === '') {
        throw new Error(`Invalid property: '${property}'`);
    }

    // get next child node at 'property'
    const childNodeIndex = getChildIndex(parentNode, property);
    if (childNodeIndex === -1 && frags.length > 0) {
        // given path is invalid
        parentNode.schemaNode.createError('invalid-path-error', {
            pointer: join(parentNode.pointer, property, ...frags),
            value,
            schema: parentNode?.schema,
            reason: `no node found at '${parentNode.pointer}/${property}'`,
            where: 'resolving json pointer to node in `set`'
        });
    }

    // children will be modified - unlink them
    parentNode.children = [...parentNode.children];

    if (childNodeIndex === -1) {
        // new child -> create & insert
        const result = createChildNode(parentNode, property, value);
        if (isJsonError(result)) {
            return result;
        }
        changeSet.push(...result);
        return;
    }

    const childNode = parentNode.children[childNodeIndex];
    if (frags.length === 0) {
        // update target node's value
        if (isValueNode(childNode) || isFileNode(childNode)) {
            const changesOrError = updateValueNode(parentNode, childNode, value);
            if (isJsonError(changesOrError)) {
                return changesOrError;
            }
            changeSet.push(...changesOrError);
            return;
        }

        // replace node, creating new object or array tree
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
        // given path is invalid
        parentNode.schemaNode.createError('invalid-path-error', {
            pointer: join(parentNode.pointer, property, ...frags),
            value: getData(childNode),
            schema: childNode.schema,
            reason: 'expected parent data to be object or array',
            where: 'resolving json pointer to node in transform.change'
        });
    }

    // @ts-ignore @todo type helper properties set by create
    const childSchemaNode = childNode.schemaNode;
    if (isReduceable(childSchemaNode)) {
        // child node has a dynamic schema which may change based in new value,
        // thus we must test recreate sub tree if schema differs
        const currentData = getData(childNode);
        const { node: currentSchemaNode } = childSchemaNode.reduceNode(currentData);

        const nextData = gp.set(getData(childNode), join(frags), value);
        const { node: nextSchemaNode } = childSchemaNode.reduceNode(nextData);

        if (schemaHasChanged(currentSchemaNode, nextSchemaNode)) {
            // @todo further diff schema and check for specific changes (sync)
            const newChild = createNode(childSchemaNode, nextData, childNode.pointer, parentNode.type === 'array');
            changeSet.push({ type: 'delete', node: childNode });
            changeSet.push({ type: 'create', node: newChild });
            newChild.id = childNode.id;
            parentNode.children[childNodeIndex] = newChild;
            syncNodes(childNode, newChild);
            return;
        }
    }

    const nextParentNode = { ...childNode } as ParentNode;
    parentNode.children[childNodeIndex] = nextParentNode;
    return setNext(nextParentNode, frags, frags.shift() as string, value, changeSet);
}
