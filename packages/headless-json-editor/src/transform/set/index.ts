import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { create } from '../../node/create';
import { split, join } from 'gson-pointer';
import { Node, ArrayNode, isValueNode, isParentNode, isJSONError, ParentNode, Change, JSONSchema } from '../../types';
import { invalidPathError } from '../../errors';
import { getChildNodeIndex } from '../../node/getChildNode';

import { getUpdatedData } from './getUpdatedData';
import { resolveIfThenElse } from './resolveIfThenElse';
import { resolveDependencies } from './resolveDependencies';
import { replaceChildNode } from './replaceChildNode';
import { resolveOneOf } from './resolveOneOf';
import { createChildNode } from './createChildNode';
import { updateValueNode } from './updateValueNode';

type UnknownObject = Record<string, unknown>;

/**
 * set (add, update) given data to location of json pointer
 *
 * - this function ensures that a new independent state is created while
 *     reusing most of the tree structure
 */
export function set<T extends Node = Node>(
    core: Draft,
    previousRoot: T,
    pointer: JSONPointer,
    value: any
): [JSONError] | [T, Change[]] {
    /** list of changes on nodes while performing set operation */
    const changeSet: Change[] = [];
    /** list of properties pointing to targetNode = node to add value to */
    const frags = split(pointer);
    if (frags.length === 0) {
        const newRootNode = create<T>(core, value);
        changeSet.push({ type: 'delete', node: previousRoot });
        changeSet.push({ type: 'create', node: newRootNode });
        newRootNode.id = previousRoot.id;
        return [newRootNode, changeSet];
    }

    /** new root node to return */
    const newRootNode = { ...previousRoot };
    /** previous node, never being target node. If this is not a ParentNode it is an error */
    let parentNode: Node = newRootNode; // @todo this might be really bad
    /** node of json-pointer */
    let targetNode: Node | null = newRootNode;
    /** property in parentNode pointing to targetNode */
    let childProperty = ''; // @todo this might be really bad

    /**
     * retrieve target node of json-pointer
     */
    while (frags.length > 0) {
        if (!targetNode || !isParentNode(targetNode)) {
            return [
                invalidPathError({
                    pointer,
                    reason: 'expected parent data to be object or array',
                    where: 'resolving json pointer to node in transform.change'
                })
            ];
        }

        // in case our current node has a oneOf statement, the schema might
        // change and must replace the whole subtree
        if (targetNode.schema.oneOf || targetNode.schema.oneOfSchema) {
            // build new data starting from parentNode
            const nextParentValue = getUpdatedData<UnknownObject>(parentNode, join(childProperty, frags), value);
            const changes = resolveOneOf(core, parentNode as ParentNode, childProperty, nextParentValue);
            if (changes) {
                // oneOf item has changed and new node was created
                changeSet.push(...changes);
                return [newRootNode, changeSet];
            }
        }

        if (targetNode?.type === 'array' && (targetNode.schema?.items as JSONSchema | undefined)?.oneOf) {
            const arrayData = getUpdatedData<unknown[]>(targetNode, join(frags), value);
            const changes = resolveOneOf(core, targetNode as ArrayNode, frags[0], arrayData);
            if (changes) {
                // item has changed and was replace on parentNode
                changeSet.push(...changes);
                return [newRootNode, changeSet];
            }
        }

        if (targetNode?.type === 'object' && targetNode.schema.if) {
            const [newTargetNode, changes] = resolveIfThenElse(core, targetNode, join(frags), value);
            targetNode = newTargetNode;
            changeSet.push(...changes);
        }

        if (targetNode?.type === 'object' && targetNode.schema.dependencies) {
            // replace whole object and reuse currently edited node
            const [newTargetNode, changes] = resolveDependencies(core, targetNode, frags, value);
            targetNode = newTargetNode;
            changeSet.push(...changes);
        }

        // unlink children of current node
        targetNode.children = [...targetNode.children];
        childProperty = frags.shift() as string;
        // step into next child (current targetNode becomes next parentNode)
        const targetIndex = getChildNodeIndex(targetNode, childProperty);
        if (targetIndex >= 0) {
            // unlink and assign next child node
            targetNode.children[targetIndex] = {
                // @todo unnecessary unlink for last target node
                ...targetNode.children[targetIndex]
            };
            // update nodes for next iteration
            parentNode = targetNode;
            targetNode = targetNode.children[targetIndex];
        } else {
            // no child node was found, so we are about to set a new node
            parentNode = targetNode;
            targetNode = null;
        }
    }

    if (!isParentNode(parentNode)) {
        throw new Error(
            `Expected node '${parentNode.pointer}' (${parentNode.type}) to be object or array to set value on '${pointer}'`
        );
    }

    /**
     * set value to target node
     */

    // new property or item
    if (targetNode == null) {
        const changesOrError = createChildNode(core, parentNode, childProperty, value);
        if (isJSONError(changesOrError)) {
            return [changesOrError];
        }
        changeSet.push(...changesOrError);
        return [newRootNode, changeSet];
    }

    // simple node update, targetNode has already been unlinked/cloned
    if (isValueNode(targetNode)) {
        const changesOrError = updateValueNode(core, parentNode, targetNode, value);
        if (isJSONError(changesOrError)) {
            return [changesOrError];
        }
        changeSet.push(...changesOrError);
        return [newRootNode, changeSet];
    }

    // replace node, creating new object or array tree
    if (isParentNode(targetNode)) {
        const changesOrError = replaceChildNode(core, parentNode, targetNode, value);
        if (isJSONError(changesOrError)) {
            return [changesOrError];
        }
        changeSet.push(...changesOrError);
        return [newRootNode, changeSet];
    }

    throw new Error('Invalid state in transform.set');
}
