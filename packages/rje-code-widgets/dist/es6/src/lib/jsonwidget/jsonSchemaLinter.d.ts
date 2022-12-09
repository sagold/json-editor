import { Diagnostic } from '@codemirror/lint';
import { JSONSchema } from 'json-schema-library';
import { EditorView } from '@codemirror/view';
import { JsonEditor } from '@sagold/react-json-editor';
export declare function jsonSchemaLinter(editor: JsonEditor, schema: JSONSchema): (view: EditorView) => Promise<Diagnostic[]>;
