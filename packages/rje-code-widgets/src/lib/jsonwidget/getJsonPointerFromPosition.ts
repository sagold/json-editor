// tooltip
import { syntaxTree } from '@codemirror/language';
import { TreeCursor } from '@lezer/common';
import { EditorState, Text } from '@codemirror/state';
import { isWithinNode, getPropertyName } from './syntaxTreeUtils';

const STEP_INTO_NODE = ['JsonText', 'Property', 'Object', 'Array'];

export type CursorLocationType = 'property' | 'value' | 'object' | 'array' | 'outside';

export type JsonPointerLocation = {
    /** json-pointer of current cursor position */
    pointer: string;
    /** cursor on current position */
    cursor: TreeCursor;
    /** syntax type of current cursor location */
    location: CursorLocationType;
};

export function getJsonPointerFromPosition(state: EditorState, position: number) {
    const tree = syntaxTree(state);
    return getJsonPointerFromCursor(state.doc, tree.cursor(), position);
}

function getJsonPointerFromCursor(doc: Text, cursor: TreeCursor, from: number, pointer = ''): JsonPointerLocation {
    const nodeType = cursor.node.name;
    if (isWithinNode(cursor, from)) {
        // console.log(`%cwithin ${nodeType}`, 'color: gray;');
        if (STEP_INTO_NODE.includes(nodeType)) {
            cursor.next();
            return getJsonPointerFromCursor(doc, cursor, from, pointer);
        }
        // cursor is on property name
        if (nodeType === 'PropertyName') {
            return { pointer, cursor, location: 'property' };
        }
        // cursor is on a value (string, number, ...)
        // console.info('%cunchecked node type', 'color: blue;', cursor.node.name, '-> return pointer');
        return { pointer, cursor, location: 'value' };
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

    if (cursor.node.name === '}') {
        return { pointer, cursor, location: 'object' };
    }

    if (cursor.node.name === ']') {
        return { pointer, cursor, location: 'array' };
    }

    // const content = doc.sliceString(cursor.from, cursor.to);
    // console.warn(`outside of ${cursor.node.name} [${from}]: ${cursor.from} - ${cursor.to}: ${content}`);
    return { pointer, cursor, location: 'outside' };
}
