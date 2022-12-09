import { JSONError } from '../errors';
import { Node } from '../types';
/**
 * returns the node with the corresponding pointer
 */
export declare function get(node: Node, pointer: string): Node | JSONError;
