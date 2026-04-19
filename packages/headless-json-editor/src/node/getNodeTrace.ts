import { JsonPointer } from 'json-schema-library';
import { getChildNode } from './getChildNode';
import { JsonNode } from '../types';
import { split } from '@sagold/json-pointer';

/**
 * returns all nodes along the path, including the given starting node
 */
export function getNodeTrace(node: JsonNode, pointer: JsonPointer) {
    const frags = split(pointer).reverse();
    const selection = [node];

    let currentNode: JsonNode = node;
    while (frags.length) {
        const property = frags.pop() as string;
        const nextNode = getChildNode(currentNode, property);
        if (nextNode === undefined) {
            return selection;
        }
        currentNode = nextNode;
        selection.push(currentNode);
    }

    return selection;
}
