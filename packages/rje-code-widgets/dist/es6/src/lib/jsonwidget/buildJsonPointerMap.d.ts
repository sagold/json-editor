import { TreeCursor, SyntaxNode } from '@lezer/common';
export declare type PropertyLocation = {
    node: SyntaxNode;
    from: number;
    to: number;
};
export declare type PropertyLocationMap = Record<string, PropertyLocation>;
/**
 * returns a map of all jsonpointers found in json and a codemiror location as
 * their value.
 *
 * ```
 * {
 *   version: Location
 *   header: {
 *     $location: Location, // codemirror location of #/header
 *     title: Location
 *   },
 * }
 * ```
 * NO THIS ONE IS BETTER:
 * {
 *   "#/header": Location,
 *   "#/header/title": Location,
 *   "#/todos": Location,
 *   "#/todos/0": Location
 * }
 */
export declare function buildJsonPointerMap(doc: any, cursor: TreeCursor, pointer?: string, map?: PropertyLocationMap): any;
