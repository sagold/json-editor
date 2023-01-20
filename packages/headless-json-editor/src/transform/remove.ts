import { JSONPointer, JSONError, Draft, reduceSchema, isDynamicSchema } from 'json-schema-library';
import { isParentNode, Node, isJSONError, Change } from '../types';
import { invalidPathError } from '../errors';
import { getChildNodeIndex } from '../node/getChildNode';
import { updatePath } from './updatePath';
import { split } from '@sagold/json-pointer';
import { unlinkPath } from './unlinkPath';
import { json } from '../node/json';
import { updateOptionalPropertyList } from '../node/create';

export function remove<T extends Node = Node>(
    draft: Draft,
    previousRoot: T,
    pointer: JSONPointer
): [JSONError] | [T, Change[]] {
    const frags = split(pointer);
    const property = frags.pop() as string;

    const result = unlinkPath(previousRoot, frags);
    if (isJSONError(result)) {
        return [result];
    }

    const [nextRoot, parentNode] = result;
    const removeNodeIndex = getChildNodeIndex(parentNode, property);
    if (!isParentNode(parentNode)) {
        return [
            invalidPathError({
                pointer: pointer,
                reason: `path does not lead to valid destination in data/tree at ${parentNode.pointer}`,
                where: `transform: 'remove' data at '${pointer}'`
            })
        ];
    }

    const nodeToRemove = parentNode.children[removeNodeIndex];
    const changes: Change[] = [{ type: 'delete', node: nodeToRemove }];

    parentNode.children = [...parentNode.children];
    parentNode.children.splice(removeNodeIndex, 1);

    if (parentNode.type === 'array') {
        for (let i = removeNodeIndex, l = parentNode.children.length; i < l; i += 1) {
            parentNode.children[i] = updatePath(parentNode.children[i], parentNode.pointer, `${i}`);
        }
    } else if (parentNode.type === 'object') {
        // @attention: property order might change here - also: we do not have a draft here
        parentNode.missingProperties = [nodeToRemove.property, ...parentNode.missingProperties];
        changes.push({ type: 'update', node: parentNode });
    }

    // dynamic schema might change
    if (parentNode.type === 'object') {
        const nextData = json(parentNode) as Record<string, unknown>;
        // @ts-ignore
        const staticSchema = reduceSchema(draft, parentNode.sourceSchema, nextData);
        // @todo recreate node instead of patching to take care for changes in children
        parentNode.schema = staticSchema;

        // update required and missing properties
        updateOptionalPropertyList(parentNode, nextData);
    }

    return [nextRoot, changes];
}
