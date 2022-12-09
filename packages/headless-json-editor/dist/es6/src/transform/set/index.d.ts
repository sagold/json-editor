import { Draft, JSONPointer, JSONError } from 'json-schema-library';
import { Node, Change } from '../../types';
/**
 * set (add, update) given data to location of json pointer
 *
 * - this function ensures that a new independent state is created while
 *     reusing most of the tree structure
 */
export declare function set<T extends Node = Node>(core: Draft, previousRoot: T, pointer: JSONPointer, value: any): [JSONError] | [T, Change[]];
