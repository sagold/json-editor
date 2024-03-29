import { TreeCursor } from '@lezer/common';
import { getPropertyName } from './syntaxTreeUtils';
import { Text } from '@codemirror/state';
import { Diagnostic } from '@codemirror/lint';

const STEP_INTO_NODE = ['JsonText', 'Property', 'PropertyName', 'Object', 'Array'];

export function jsonLintPropertyDuplicates(doc: Text, cursor: TreeCursor, duplicates: Diagnostic[] = []): Diagnostic[] {
    const nodeType = cursor.node.name;
    if (STEP_INTO_NODE.includes(nodeType)) {
        cursor.next();
        return jsonLintPropertyDuplicates(doc, cursor, duplicates);
    }
    if (nodeType === '{' || nodeType === '[') {
        const properties = {};
        while (cursor.nextSibling() && cursor.node.name !== '}') {
            if (cursor.node.name === 'Property') {
                const name = getPropertyName(doc, cursor);
                const propertyNameCursor = cursor.node.cursor();
                propertyNameCursor.next();
                const propertyInfo: Diagnostic = {
                    from: propertyNameCursor.from,
                    to: propertyNameCursor.to,
                    severity: 'error',
                    message: `Duplicated property '${name}'. Remove duplication as all previous properties with same name will removed in export.`
                };
                if (properties[name]) {
                    duplicates.push(properties[name]);
                }
                properties[name] = propertyInfo;
            }
            duplicates.push(...jsonLintPropertyDuplicates(doc, cursor.node.cursor()));
        }
    }
    // console.log('skip type', cursor.node.name);
    return duplicates;
}
