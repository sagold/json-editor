import gp from '@sagold/json-pointer';
import { invalidPathError, JsonError } from '../errors';
import { Node } from '../types';
import { getChildNode } from './getChildNode';
import { json } from './json';

/**
 * returns the node with the corresponding pointer
 */
export function get(node: Node, pointer: string): Node | JsonError {
    const frags = gp.split(pointer);
    return step(node, frags, []);
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
    return invalidPathError({ pointer: gp.join(pointer), schema: node.schema, value: json(node) });
}
