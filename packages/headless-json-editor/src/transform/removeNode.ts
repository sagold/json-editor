import { JsonPointer, JsonError } from 'json-schema-library';
import { isParentNode, Node, isJsonError, Change } from '../types';
import { getChildIndex } from '../node/getChildNode';
import { updatePath } from './updatePath';
import { split } from '@sagold/json-pointer';
import { unlinkPath } from './unlinkPath';
import { getData } from '../node/getData';
import { updateOptionalPropertyList } from '../node/createNode';

export function removeNode<T extends Node = Node>(previousRoot: T, pointer: JsonPointer): [JsonError] | [T, Change[]] {
    const frags = split(pointer);
    const property = frags.pop() as string;

    const result = unlinkPath(previousRoot, frags);
    if (isJsonError(result)) {
        return [result];
    }

    const [nextRoot, parentNode] = result;
    const removeNodeIndex = getChildIndex(parentNode, property);
    if (!isParentNode(parentNode)) {
        return [
            previousRoot.schemaNode.createError('invalid-path-error', {
                pointer: parentNode.pointer,
                schema: parentNode.schema,
                value: getData(parentNode),
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
        const nextData = getData(parentNode) as Record<string, unknown>;

        console.log('parent schema', parentNode.schemaNode.schema, nextData);

        const { node: nextSchemaNode, error } = parentNode.schemaNode.reduceNode(
            { nextData },
            {
                pointer: parentNode.pointer
            }
        );

        console.log('parent schema reduced', nextSchemaNode?.schema);

        if (error) {
            console.log('error', error);
        }
        if (nextSchemaNode) {
            // @todo recreate node instead of patching to take care for changes in children
            parentNode.schema = nextSchemaNode.schema;
            parentNode.schemaNode = nextSchemaNode;
            // update required and missing properties
            updateOptionalPropertyList(parentNode);
        }
    }

    return [nextRoot, changes];
}
