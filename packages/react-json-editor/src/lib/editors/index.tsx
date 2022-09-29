import { MultiSelectEditorPlugin } from './MultiSelectEditor';
import { SelectOneOfEditorPlugin } from './SelectOneOfEditor';
import { ArrayEditorPlugin } from './ArrayEditor';
import { BooleanEditorPlugin } from './BooleanEditor';
import { NumberEditorPlugin } from './NumberEditor';
import { ObjectEditorPlugin } from './ObjectEditor';
import { StringEditorPlugin, SelectEditor } from './StringEditor';
import { NullEditorPlugin } from './NullEditor';
import { ErrorEditorPlugin } from './ErrorEditor';
import { UnknownEditorPlugin } from './UnknownEditor';
import { Node } from 'headless-json-editor';
import { Editor, EditorPlugin } from './decorators';

export type { Editor };

// @todo consider removing complex EditorPlugin type
export const defaultEditors: EditorPlugin[] = [
    {
        id: 'hidden-editor',
        use: (node) => node.options.hidden,
        Editor: () => null
    },
    SelectOneOfEditorPlugin,
    MultiSelectEditorPlugin,
    ArrayEditorPlugin,
    ObjectEditorPlugin,
    {
        id: 'select-string-editor',
        use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
        Editor: SelectEditor
    },
    StringEditorPlugin,
    NumberEditorPlugin,
    BooleanEditorPlugin,
    NullEditorPlugin,
    ErrorEditorPlugin,
    UnknownEditorPlugin
];

export type GetEditor = (node: Node, options?: Record<string, unknown>) => Editor;

export function createGetEditor(editors: EditorPlugin[]): GetEditor {
    return function getEditor(node: Node, options?: Record<string, unknown>): Editor {
        const { Editor } = editors.find((ed) => ed.use(node, options)) || {};
        if (Editor) {
            return Editor;
        }
        throw new Error(`Failed retrieving an editor for '${node.pointer}'`);
    };
}