import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { Draft } from 'json-schema-library';
import { JSONSchema } from '@sagold/react-json-editor';
export declare const jsonSchemaCompletion: (draft: Draft, schema: JSONSchema) => (context: CompletionContext) => Promise<CompletionReturnValue>;
declare type CompletionReturnValue = null | {
    from: number;
    options: Completion[];
};
export {};
