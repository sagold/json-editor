import {
    CompileOptions,
    compileSchema as _compileSchema,
    draftEditor,
    extendDraft,
    JsonSchema
} from 'json-schema-library';

export const jsonEditorDraft = extendDraft(draftEditor, {
    errors: {
        'invalid-path-error': "Path '{{pointer}}' does not exist in data",
        'invalid-node-type-error': 'Invalid not type {{ type }} given'
    }
});

export function compileSchema(schema: JsonSchema, options: Partial<CompileOptions> = {}) {
    return _compileSchema(schema, { drafts: [jsonEditorDraft], ...options });
}
