import {
    CompileOptions,
    compileSchema as _compileSchema,
    extendDraft,
    draft04,
    draft07,
    draft2019,
    draft2020,
    oneOfFuzzyKeyword,
    JsonSchema
} from 'json-schema-library';

export const drafts = [draft04, draft07, draft2020, draft2019].map((draft) =>
    extendDraft(draft, {
        keywords: [oneOfFuzzyKeyword],
        errors: {
            'invalid-path-error': "Path '{{pointer}}' does not exist in data",
            'invalid-node-type-error': 'Invalid not type {{ type }} given'
        }
    })
);

export function compileSchema(schema: JsonSchema, options: Partial<CompileOptions> = {}) {
    return _compileSchema(schema, { drafts, ...options });
}
