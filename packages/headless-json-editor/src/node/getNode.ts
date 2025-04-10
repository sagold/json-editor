import gp from '@sagold/json-pointer';
import { Node, JsonError } from '../types';
import { getChildNode } from './getChildNode';
import { getData } from './getData';

/**
 * returns the node with the corresponding pointer
 */
export function getNode<T extends Node = Node>(node: Node, pointer: string): T | JsonError {
    const frags = gp.split(pointer);
    return step(node, frags, []) as T | JsonError;
}

function step(node: Node, frags: string[], pointer: string[]): Node | JsonError {
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
