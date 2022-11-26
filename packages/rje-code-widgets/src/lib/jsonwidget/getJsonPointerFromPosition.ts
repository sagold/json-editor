// tooltip
import { syntaxTree } from '@codemirror/language';
import { TreeCursor } from '@lezer/common';
import { EditorState, Text } from '@codemirror/state';

export function getJsonPointerFromPosition(state: EditorState, position: number) {
    const tree = syntaxTree(state);
    return getJsonPointerFromCursor(state.doc, tree.cursor(), position);
}

function isWithinNode(cursor: TreeCursor, position: number) {
    return cursor.from <= position && position <= cursor.to;
}

export function getPropertyName(doc: Text, cursor: TreeCursor) {
    if (cursor.node.name !== 'Property') {
        throw new Error(`Cannot resolve property name of none property: ${cursor.node.name}`);
    }
    const propertyCursor = cursor.node.cursor();
    propertyCursor.next();
    // strips quotes
    return doc.sliceString(propertyCursor.from + 1, propertyCursor.to - 1);
}

const STEP_INTO_NODE = ['JsonText', 'Property', 'Object', 'Array'];

function getJsonPointerFromCursor(
    doc: Text,
    cursor: TreeCursor,
    from: number,
    pointer = ''
): { pointer: string; cursor: TreeCursor } {
    const nodeType = cursor.node.name;
    if (isWithinNode(cursor, from)) {
        // console.log(`%cwithin ${nodeType}`, 'color: gray;');
        if (STEP_INTO_NODE.includes(nodeType)) {
            cursor.next();
            return getJsonPointerFromCursor(doc, cursor, from, pointer);
        }
        // cursor is on property name
        if (nodeType === 'PropertyName') {
            return { pointer, cursor };
        }
        // cursor is on a value (string, number, ...)
        // console.info('%cunchecked node type', 'color: blue;', cursor.node.name, '-> return pointer');
        return { pointer, cursor };
    }

    // console.log(`%cfind position in ${cursor.node.name} [${from}]: ${cursor.from} - ${cursor.to}`, 'color: gray;');
    const isArray = cursor.node.name === '[';
    let childIndex = 0;
    while (cursor.nextSibling()) {
        if (isWithinNode(cursor, from)) {
            if (cursor.node.name === 'Property') {
                const propertyName = getPropertyName(doc, cursor);
                return getJsonPointerFromCursor(doc, cursor, from, `${pointer}/${propertyName}`);
            }
            return getJsonPointerFromCursor(doc, cursor, from, isArray ? `${pointer}/${childIndex}` : pointer);
        }
        // console.log(`%cskip [${from}]: ${cursor.from} - ${cursor.to}`, 'color: gray;', cursor.node.name);
        childIndex++;
    }

    console.warn(`outside of ${cursor.node.name} [${from}]: ${cursor.from} - ${cursor.to}`);
    return { pointer, cursor };
}
