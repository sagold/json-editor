import { MultiSelectEditorPlugin } from './MultiSelectEditor';
import { SelectOneOfEditorPlugin } from './SelectOneOfEditor';
import { ArrayEditorPlugin } from './ArrayEditor';
import { BooleanEditorPlugin } from './BooleanEditor';
import { NumberEditorPlugin } from './NumberEditor';
import { ObjectEditorPlugin } from './ObjectEditor';
import { StringEditorPlugin, TextEditorPlugin, SelectEditor } from './StringEditor';
import { NullEditorPlugin } from './NullEditor';
import { ErrorEditorPlugin } from './ErrorEditor';
import { UnknownEditorPlugin } from './UnknownEditor';
import { EditorPlugin } from './decorators';

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
    TextEditorPlugin,
    StringEditorPlugin,
    NumberEditorPlugin,
    BooleanEditorPlugin,
    NullEditorPlugin,
    ErrorEditorPlugin,
    UnknownEditorPlugin
];
