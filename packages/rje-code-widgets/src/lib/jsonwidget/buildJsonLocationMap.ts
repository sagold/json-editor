import { TreeCursor, SyntaxNode } from '@lezer/common';
import { Text } from '@codemirror/state';

export type PropertyLocation = {
    node: SyntaxNode;
    from: number;
    to: number;
};

export type PropertyLocationMap = Record<string, PropertyLocation>;

function getValue(doc: Text, cursor: TreeCursor) {
    return doc.sliceString(cursor.from, cursor.to);
}

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
export function buildJsonLocationMap(doc, cursor: TreeCursor, pointer = '#', map: PropertyLocationMap = {}) {
    const nodeType = cursor.node.name;
    if (nodeType === 'JsonText') {
        cursor.next(); // Object | Array
        return buildJsonLocationMap(doc, cursor, pointer, map);
    }

    if (nodeType === 'Object') {
        cursor.next(); // {
        while (cursor.nextSibling()) {
            if (cursor.node.name === 'Property') {
                const location: PropertyLocation = { node: cursor.node, from: cursor.from, to: cursor.to };
                const propertyCursor = cursor.node.cursor();
                propertyCursor.next();
                const jsonName = getValue(doc, propertyCursor);
                // save whole property as target (location = name+value)
                map[`${pointer}/${JSON.parse(jsonName)}`] = location;
                propertyCursor.next();
                if (propertyCursor.node.name === 'Object' || propertyCursor.node.name === 'Array') {
                    buildJsonLocationMap(doc, propertyCursor, `${pointer}/${JSON.parse(jsonName)}`, map);
                }
            }
        }
        return map;
    }

    if (nodeType === 'Array') {
        cursor.next(); // [
        let index = 0;
        while (cursor.nextSibling()) {
            if (cursor.node.name !== ']') {
                map[`${pointer}/${index}`] = { node: cursor.node, from: cursor.from, to: cursor.to };
                if (cursor.node.name === 'Object' || cursor.node.name === 'Array') {
                    buildJsonLocationMap(doc, cursor, `${pointer}/${index}`, map);
                }
                index++;
            }
        }
        return map;
    }

    console.error('Unparsed node', cursor.node.name || cursor);
    return {};
}

/*
tree
JsonText
    Object
        {
            Property
                PropertyName
                    Null
            Property
                PropertyName
                    Object
                    {
                    Property
                    PropertyName
                    String
                    }
            Property
                PropertyName
                String
            Property
                PropertyName
                String
            Property
                PropertyName
                Array
                [
                    String
                    String
                ]
        }
*/
