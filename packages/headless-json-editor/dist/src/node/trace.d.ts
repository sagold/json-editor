import { JSONPointer } from 'json-schema-library';
import { Node } from '../types';
/**
 * returns all nodes along the path, including the given starting node
 */
export declare function trace(node: Node, pointer: JSONPointer): Node[];
