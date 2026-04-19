import gp from '@sagold/json-pointer';
import { JsonNode, JsonError } from '../types';
import { getChildNode } from './getChildNode';
import { getData } from './getData';

/**
 * returns the node with the corresponding pointer
 */
export function getNode<T extends JsonNode = JsonNode>(node: JsonNode, pointer: string): T | JsonError {
    const frags = gp.split(pointer);
    return step(node, frags, []) as T | JsonError;
}

function step(node: JsonNode, frags: string[], pointer: string[]): JsonNode | JsonError {
    if (frags.length === 0) {
        return node;
    }
    const prop = frags.shift() as string;
    pointer.push(prop);
    const nextNode = getChildNode(node, prop);
    if (nextNode) {
        return step(nextNode, frags, pointer);
    }

    return node.schemaNode.createError('invalid-path-error', {
        pointer: gp.join(pointer),
        schema: node.schema,
        value: getData(node)
    });
}
