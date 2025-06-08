import { TreeCursor, SyntaxNode } from '@lezer/common';
import { getValue } from './syntaxTreeUtils';

export type PropertyLocation = {
    node: SyntaxNode;
    from: number;
    to: number;
};

export type PropertyLocationMap = Record<string, PropertyLocation>;

/**
 * returns a map of all jsonpointers found in json and a codemiror location as
 * their value.
 *
 * ```ts
 * {
 *   "#/header": Location,
 *   "#/header/title": Location,
 *   "#/todos": Location,
 *   "#/todos/0": Location
 * }
 * ```
 */
export function buildJsonPointerMap(doc, cursor: TreeCursor, pointer = '#', map: PropertyLocationMap = {}) {
    const nodeType = cursor.node.name;
    if (nodeType === 'JsonText') {
        cursor.next(); // Object | Array
        return buildJsonPointerMap(doc, cursor, pointer, map);
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
                    buildJsonPointerMap(doc, propertyCursor, `${pointer}/${JSON.parse(jsonName)}`, map);
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
                    buildJsonPointerMap(doc, cursor, `${pointer}/${index}`, map);
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
