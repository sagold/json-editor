import { JSONPointer, JSONError } from 'json-schema-library';
import { ObjectNode, ArrayNode, Node } from '../types';
export declare function buildPathsMap(paths: (JSONPointer | string[])[]): Record<string, unknown>;
export declare function unlinkMap(previousRoot: Node, map: {
    [p: string]: any;
}): void;
/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export declare function unlinkPaths(previousRoot: Node, paths: JSONPointer[]): void;
/**
 * Returns a new tree with cloned nodes along the given path
 * @returns [new root node, node at pointer] or error if path is invalid
 */
export declare function unlinkPath(previousRoot: Node, pointer: JSONPointer | string[]): JSONError | [ObjectNode | ArrayNode, Node];
