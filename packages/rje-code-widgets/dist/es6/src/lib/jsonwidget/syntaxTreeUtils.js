/** @returns the contents of the node (cursor range) */
export function getValue(doc, cursor) {
    return doc.sliceString(cursor.from, cursor.to);
}
/** @returns the property name of a property node */
export function getPropertyName(doc, cursor) {
    if (cursor.node.name !== 'Property') {
        throw new Error(`Cannot resolve property name of none property: ${cursor.node.name}`);
    }
    const propertyCursor = cursor.node.cursor();
    propertyCursor.next();
    // strips quotes
    return doc.sliceString(propertyCursor.from + 1, propertyCursor.to - 1);
}
/** @returns true, given position is within cursor range */
export function isWithinNode(cursor, position) {
    return cursor.from <= position && position <= cursor.to;
}
//# sourceMappingURL=syntaxTreeUtils.js.map