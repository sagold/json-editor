import { HeadlessJsonEditor, Node } from 'headless-json-editor';
import { GetEditor } from './editors';

export type Editor<T = Node> = (props: EditorProps<T>) => JSX.Element;

export type EditorPlugin = {
    readonly id: string;
    use: (node: Node, options?: Record<string, unknown>) => boolean;
    Editor: Editor;
};

export type EditorProps<T = Node> = {
    readonly node: T;
    readonly instance: HeadlessJsonEditor;
    getEditor: GetEditor;
};
