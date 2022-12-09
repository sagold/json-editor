import { TreeCursor } from '@lezer/common';
import { Text } from '@codemirror/state';
/** @returns the contents of the node (cursor range) */
export declare function getValue(doc: Text, cursor: TreeCursor): string;
/** @returns the property name of a property node */
export declare function getPropertyName(doc: Text, cursor: TreeCursor): string;
/** @returns true, given position is within cursor range */
export declare function isWithinNode(cursor: TreeCursor, position: number): boolean;
