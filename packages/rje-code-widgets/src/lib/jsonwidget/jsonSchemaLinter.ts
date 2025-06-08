import gp from '@sagold/json-pointer';
import { buildJsonPointerMap } from './buildJsonPointerMap';
import { Diagnostic } from '@codemirror/lint';
import { JsonSchema } from 'json-schema-library';
import { EditorView } from '@codemirror/view';
import { Editor } from '@sagold/react-json-editor';
import { jsonParseLinter } from '@codemirror/lang-json';
import { SyntaxNode } from '@lezer/common';
import { syntaxTree } from '@codemirror/language';
import { jsonLintPropertyDuplicates } from './jsonLintPropertyDuplicates';
import { SchemaNode } from 'headless-json-editor';

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

export function jsonSchemaLinter(editor: Editor, schema: JsonSchema) {
    const localSchemaNode = editor.root.schemaNode.compileSchema(schema);

    return async function (view: EditorView): Promise<Diagnostic[]> {
        const jsonLint = jsonParseLinter();
        const jsonLintResult = jsonLint(view);
        if (jsonLintResult.length > 0) {
            return jsonLintResult;
        }
        return runJsonSchemaLinter(localSchemaNode, view);
    };
}

function runJsonSchemaLinter(schemaNode: SchemaNode, view: EditorView): Diagnostic[] {
    const currentData = JSON.parse(view.state.doc.toString());
    const { errors } = schemaNode.validate(currentData);
    if (errors.length === 0) {
        return [];
    }

    const tree = syntaxTree(view.state);
    const locationMap = buildJsonPointerMap(view.state.doc, tree.cursor());
    const duplicateProperties = jsonLintPropertyDuplicates(view.state.doc, tree.cursor());

    const validationErrors: Diagnostic[] = errors.map((error) => {
        let flagPropertyNameOnly = false;
        let flagPropertyValueOnly = true;
        let pointer = error.data?.pointer;
        if (error.code === 'no-additional-properties-error') {
            pointer = gp.join(error.data?.pointer as string, error.data?.property as string);
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

    if (duplicateProperties.length > 0) {
        validationErrors.push(...duplicateProperties);
    }

    return validationErrors.filter((err) => err != null);
}
