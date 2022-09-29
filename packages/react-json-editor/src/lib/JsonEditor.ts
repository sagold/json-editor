import { Node } from 'headless-json-editor';
import { ErrorEditor } from './editors/ErrorEditor';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions, isNode } from 'headless-json-editor';
import { Editor, EditorPlugin } from './editors/decorators';

export type JsonEditorOptions = HeadlessJsonEditorOptions & {
    editors: EditorPlugin[];
};

export class JsonEditor extends HeadlessJsonEditor {
    editors: EditorPlugin[];

    constructor(options: JsonEditorOptions) {
        super(options);
        this.editors = options.editors;
    }

    getEditor(node: Node, options?: Record<string, unknown>): Editor {
        if (!isNode(node)) {
            console.log('invalid node passed to getEditor', node);
            return ErrorEditor;
        }
        const { Editor } = this.editors.find((ed) => ed.use(node, options)) || {};
        if (Editor) {
            return Editor;
        }
        throw new Error(`Failed retrieving an editor for '${node.pointer}'`);
    }
}
