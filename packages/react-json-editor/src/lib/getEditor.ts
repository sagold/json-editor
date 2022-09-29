import { Node } from 'headless-json-editor';
import { Editor, EditorPlugin } from './editors/decorators';

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
