import { TreeCursor } from '@lezer/common';
import { Text } from '@codemirror/state';

/** @returns the contents of the node (cursor range) */
export function getValue(doc: Text, cursor: TreeCursor) {
    return doc.sliceString(cursor.from, cursor.to);
}

/** @returns the property name of a property node */
export function getPropertyName(doc: Text, cursor: TreeCursor) {
    if (cursor.node.name !== 'Property') {
        throw new Error(`Cannot resolve property name of none property: ${cursor.node.name}`);
    }
    const propertyCursor = cursor.node.cursor();
    propertyCursor.next();
    // strips quotes
    return doc.sliceString(propertyCursor.from + 1, propertyCursor.to - 1);
}

/** @returns true, given position is within cursor range */
export function isWithinNode(cursor: TreeCursor, position: number) {
    return cursor.from <= position && position <= cursor.to;
}
