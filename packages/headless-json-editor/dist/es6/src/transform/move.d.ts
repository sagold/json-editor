import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node, Change } from '../types';
/**
 * move array item to another index
 */
export declare function move(core: Draft, rootNode: Node, pointerToArray: JSONPointer, from: number, to: number): [JSONError] | [Node, Change[]];
