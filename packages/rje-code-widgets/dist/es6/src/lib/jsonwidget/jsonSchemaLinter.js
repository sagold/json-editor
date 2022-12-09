import gp from 'gson-pointer';
import { buildJsonPointerMap } from './buildJsonPointerMap';
import { Draft } from 'json-schema-library';
import { jsonParseLinter } from '@codemirror/lang-json';
import { syntaxTree } from '@codemirror/language';
import { jsonLintPropertyDuplicates } from './jsonLintPropertyDuplicates';
function getPropertyNameCursor(node) {
    if (node.name === 'Property') {
        const cursor = node.cursor();
        cursor.next();
        return cursor;
    }
    return undefined;
}
function getPropertyValueCursor(node) {
    const cursor = getPropertyNameCursor(node);
    if (cursor) {
        cursor.nextSibling();
        return cursor;
    }
    return undefined;
}
export function jsonSchemaLinter(editor, schema) {
    const rootSchema = (schema === null || schema === void 0 ? void 0 : schema.$ref) ? editor.draft.getSchema() : schema;
    const draft = new Draft(editor.draft.config, rootSchema);
    const localSchema = draft.compileSchema(schema);
    return async function (view) {
        const jsonLint = jsonParseLinter();
        const jsonLintResult = jsonLint(view);
        if (jsonLintResult.length > 0) {
            return jsonLintResult;
        }
        return runJsonSchemaLinter(draft, localSchema, view);
    };
}
function runJsonSchemaLinter(draft, schema, view) {
    const currentData = JSON.parse(view.state.doc.toString());
    const errors = draft.validate(currentData, schema);
    if (errors.length === 0) {
        return [];
    }
    const tree = syntaxTree(view.state);
    const locationMap = buildJsonPointerMap(view.state.doc, tree.cursor());
    const duplicateProperties = jsonLintPropertyDuplicates(view.state.doc, tree.cursor());
    const validationErrors = errors.map((error) => {
        var _a, _b, _c;
        let flagPropertyNameOnly = false;
        let flagPropertyValueOnly = true;
        let pointer = (_a = error.data) === null || _a === void 0 ? void 0 : _a.pointer;
        if (error.code === 'no-additional-properties-error') {
            pointer = gp.join((_b = error.data) === null || _b === void 0 ? void 0 : _b.pointer, (_c = error.data) === null || _c === void 0 ? void 0 : _c.property);
            flagPropertyNameOnly = true;
        }
        else if (error.code === 'min-length-error') {
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
        }
        else if (flagPropertyValueOnly) {
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
//# sourceMappingURL=jsonSchemaLinter.js.map