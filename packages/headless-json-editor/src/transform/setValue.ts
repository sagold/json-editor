import { Draft, JsonPointer, JsonError, isDynamicSchema, resolveDynamicSchema } from 'json-schema-library';
// import { deepEqual } from 'fast-equals';
import { getData } from '../node/getData';
import { createNode } from '../node/createNode';
import gp, { split, join } from '@sagold/json-pointer';
import { Node, isValueNode, isParentNode, isJsonError, ParentNode, Change, JsonSchema, isFileNode } from '../types';
import { invalidPathError } from '../errors';
import { getChildIndex } from '../node/getChildNode';
import { deepEqual } from 'fast-equals';

import { replaceChildNode } from './set/replaceChildNode';
import { createChildNode } from './set/createChildNode';
import { updateValueNode } from './set/updateValueNode';

export function setValue<T extends Node = Node>(
    draft: Draft,
    ast: T,
    pointer: JsonPointer,
    value: any
): [JsonError] | [T, Change[]] {
    /** steps to value */
    const frags = split(pointer);
    /** list of changes on nodes while performing set operation */
    const changeSet: Change[] = [];

    // if change on root, replace all, but reuse root-id
    if (frags.length === 0 || !isParentNode(ast)) {
        const newAst = createNode<T>(draft, value);
        changeSet.push({ type: 'delete', node: ast });
        changeSet.push({ type: 'create', node: newAst });
        newAst.id = ast.id;
        return [newAst, changeSet];
    }

    const currentRootSchema = draft.getSchema();
    if (isDynamicSchema(currentRootSchema)) {
        // root node has a dynamic schema which may change based in new value,
        // thus we must test recreate sub tree if schema differs
        const currentData = getData(ast);
        const currentSchema = resolveDynamicSchema(draft, currentRootSchema as JsonSchema, currentData, pointer);
        const nextData = getData(ast);
        gp.set(nextData, pointer, value);
        const nextSchema = resolveDynamicSchema(draft, currentRootSchema as JsonSchema, nextData, pointer);
        if (!deepEqual(currentSchema, nextSchema)) {
            const fullNextData = draft.getTemplate(nextData, draft.getSchema(), { addOptionalProps: false });
            // console.log('root schema change', draft.getSchema(), "for", fullNextData);
            const newAst = createNode<T>(draft, fullNextData);
            changeSet.push({ type: 'delete', node: ast });
            changeSet.push({ type: 'create', node: newAst });
            newAst.id = ast.id;
            return [newAst, changeSet];
        } else {
            // console.log('root schema doesnt change', currentSchema);
        }
    } else {
        // console.log('root is not a dynamic schema', currentRootSchema);
    }

    // unlink tree and follow path to value
    const newAst = { ...ast };
    const error = setNext(draft, newAst, frags, frags.shift() as string, value, changeSet);
    if (error) {
        return [error];
    }

    return [newAst, changeSet];
}

/**
 * @param parentNode - unlinked parent node which will be modified
 */
function setNext(
    draft: Draft,
    parentNode: ParentNode,
    frags: string[],
    property: string,
    value: unknown,
    changeSet: Change[]
): JsonError | undefined {
    if (property == null || property === '') {
        throw new Error(`Invalid property: '${property}'`);
    }

    // console.log('set next', property, frags, value);

    // get next child node at 'property'
    const childNodeIndex = getChildIndex(parentNode, property);
    if (childNodeIndex === -1 && frags.length > 0) {
        // given path is invalid
        return invalidPathError({
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
        const result = createChildNode(draft, parentNode, property, value);
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
            const changesOrError = updateValueNode(draft, parentNode, childNode, value);
            if (isJsonError(changesOrError)) {
                return changesOrError;
            }
            changeSet.push(...changesOrError);
            return;
        }

        // replace node, creating new object or array tree
        if (isParentNode(childNode)) {
            const changesOrError = replaceChildNode(draft, parentNode, childNode, value);
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
        return invalidPathError({
            pointer: join(parentNode.pointer, property, ...frags),
            value: getData(childNode),
            schema: childNode.schema,
            reason: 'expected parent data to be object or array',
            where: 'resolving json pointer to node in transform.change'
        });
    }

    // @attention helper properties set by create
    // @ts-ignore
    const childSchema = childNode.sourceSchema ?? childNode.schema;
    if (isDynamicSchema(childSchema)) {
        // console.log('child has dynamic schema', property, childSchema);
        // child node has a dynamic schema which may change based in new value,
        // thus we must test recreate sub tree if schema differs
        const currentData = getData(childNode);
        const currentSchema = resolveDynamicSchema(draft, childSchema, currentData, childNode.pointer);
        let nextData = getData(childNode);
        nextData = gp.set(nextData, join(frags), value);
        const nextSchema = resolveDynamicSchema(draft, childSchema, nextData, childNode.pointer);

        if (!deepEqual(currentSchema, nextSchema)) {
            // console.log('child schema changes', currentSchema, '->', nextSchema);
            const newChild = createNode(draft, nextData, childSchema, childNode.pointer, parentNode.type === 'array');
            changeSet.push({ type: 'delete', node: childNode });
            changeSet.push({ type: 'create', node: newChild });
            newChild.id = childNode.id;
            parentNode.children[childNodeIndex] = newChild;
            return;
        }
    } else {
        // @ts-ignore
        // console.log('child has no dynamic schema', property, childSchema);
    }

    const nextParentNode = { ...childNode };
    parentNode.children[childNodeIndex] = nextParentNode;
    return setNext(draft, nextParentNode, frags, frags.shift() as string, value, changeSet);
}
