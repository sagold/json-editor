import { Node } from 'headless-json-editor';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions } from 'headless-json-editor';
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
        const { Editor } = this.editors.find((ed) => ed.use(node, options)) || {};
        if (Editor) {
            return Editor;
        }
        throw new Error(`Failed retrieving an editor for '${node.pointer}'`);
    }
}
