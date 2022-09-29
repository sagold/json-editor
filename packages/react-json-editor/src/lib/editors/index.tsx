import { ArrayEditorPlugin } from './ArrayEditor';
import { BooleanEditorPlugin } from './BooleanEditor';
import { EditorPlugin } from './decorators';
import { ErrorEditorPlugin } from './ErrorEditor';
import { MasterDetailEditorPlugin } from './masterdetaileditor/MasterDetailEditor';
import { MultiSelectEditorPlugin } from './MultiSelectEditor';
import { NullEditorPlugin } from './NullEditor';
import { NumberEditorPlugin } from './NumberEditor';
import { ObjectEditorPlugin } from './ObjectEditor';
import { SelectOneOfEditorPlugin } from './SelectOneOfEditor';
import { StringEditorPlugin, SelectEditor } from './StringEditor';
import { TextEditorPlugin } from './TextEditor';
import { UnknownEditorPlugin } from './UnknownEditor';

// @todo consider removing complex EditorPlugin type
export const defaultEditors: EditorPlugin[] = [
    {
        id: 'hidden-editor',
        use: (node) => node.options?.hidden,
        Editor: () => null
    },
    MasterDetailEditorPlugin,
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
