// tooltip
import { syntaxTree } from '@codemirror/language';
import { isWithinNode, getPropertyName } from './syntaxTreeUtils';
const STEP_INTO_NODE = ['JsonText', 'Property', 'Object', 'Array'];
export function getJsonPointerFromPosition(state, position) {
    const tree = syntaxTree(state);
    return getJsonPointerFromCursor(state.doc, tree.cursor(), position);
}
function getJsonPointerFromCursor(doc, cursor, from, pointer = '') {
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
//# sourceMappingURL=getJsonPointerFromPosition.js.map