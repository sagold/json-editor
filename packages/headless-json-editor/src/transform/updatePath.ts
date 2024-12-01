import { JsonPointer } from 'json-schema-library';
import { Node } from '../types';
import gp from '@sagold/json-pointer';

const POINTER_PREFIX = '#';
function ensurePointer(pointer: JsonPointer) {
    return pointer.replace(/^[#/]*\//, POINTER_PREFIX).replace(/^[#/]*$/, POINTER_PREFIX);
}

/**
 * Clone subtree and update pointer property of all nodes
 */
export function updatePath(node: Node, parentPointer: string, property: string) {
    const copy = { ...node };

    parentPointer = ensurePointer(parentPointer);
    copy.property = property;
    copy.pointer = gp.join(parentPointer, property);
    if (copy.type === 'array') {
        copy.children = copy.children.map((child, index) => updatePath(child, copy.pointer, `${index}`));
    } else if (copy.type === 'object') {
        copy.children = copy.children.map((child) => updatePath(child, copy.pointer, child.property));
    }
    return copy;
}
