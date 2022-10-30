import gp from 'gson-pointer';
import { jsonParseLinter } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { Diagnostic } from '@codemirror/lint';
import { syntaxTree } from '@codemirror/language';
import { buildJsonLocationMap } from './buildJsonLocationMap';
import { SyntaxNode } from '@lezer/common';
import { Draft, JSONSchema } from 'json-schema-library';
import { JsonEditor } from '@sagold/react-json-editor';

function getPropertyNameCursor(node: SyntaxNode) {
    if (node.name === 'Property') {
        const cursor = node.cursor();
        cursor.next();
        return cursor;
    }
    return undefined;
}
function getPropertyValueCursor(node: SyntaxNode) {
    const cursor = getPropertyNameCursor(node);
    if (cursor) {
        cursor.nextSibling();
        return cursor;
    }
    return undefined;
}

export function jsonSchemaLinter(editor: JsonEditor, schema: JSONSchema) {
    const draft = new Draft(editor.draft.config, schema);

    return function (view: EditorView): Diagnostic[] {
        const jsonLint = jsonParseLinter();
        const jsonLintResult = jsonLint(view);
        if (jsonLintResult.length > 0) {
            return jsonLintResult;
        }

        return runJsonSchemaLinter(draft, view);
    };
}

function runJsonSchemaLinter(draft: Draft, view: EditorView): Diagnostic[] {
    const currentData = JSON.parse(view.state.doc.toString());
    const errors = draft.validate(currentData);
    if (errors.length === 0) {
        return [];
    }

    const tree = syntaxTree(view.state);
    const locationMap = buildJsonLocationMap(view.state.doc, tree.cursor());
    // console.log('errors', errors, currentData);
    // console.log('location map', locationMap);

    // @ts-ignore
    const validationErrors: Diagnostic[] = errors.map((error) => {
        let flagPropertyNameOnly = false;
        let flagPropertyValueOnly = true;
        let pointer = error.data?.pointer;
        if (error.code === 'no-additional-properties-error') {
            pointer = gp.join(error.data?.pointer, error.data?.property);
            flagPropertyNameOnly = true;
        } else if (error.code === 'min-length-error') {
            flagPropertyValueOnly = true;
        }

        const propertyLocation = locationMap[pointer];
        if (propertyLocation == null) {
            console.warn('Failed resolving node', propertyLocation);
            return {
                from: 0,
                to: 0,
                severity: 'error',
                message: error.message
            };
        }

        let from = propertyLocation.from;
        let to = propertyLocation.to;
        if (flagPropertyNameOnly) {
            const propertyNameCursor = getPropertyNameCursor(propertyLocation.node);
            if (propertyNameCursor) {
                from = propertyNameCursor.from;
                to = propertyNameCursor.to;
            }
        } else if (flagPropertyValueOnly) {
            const propertyValueCursor = getPropertyValueCursor(propertyLocation.node);
            if (propertyValueCursor) {
                from = propertyValueCursor.from;
                to = propertyValueCursor.to;
            }
        }

        return {
            from: from,
            to: to,
            severity: 'error',
            message: error.message
        };
    });
    return validationErrors.filter((err) => err != null);
}
