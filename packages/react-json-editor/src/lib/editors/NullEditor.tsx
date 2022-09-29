import { EditorPlugin } from './decorators';
import { Node } from 'headless-json-editor';

export const NullEditor = ({ node }: { node: Node }) => (
    <div data-type="null" data-id={node.pointer}>
        <div className="field">
            <label>{node.options.title as string}</label>
        </div>
        <div className="description">{node.options.description as string}</div>
    </div>
);

export const NullEditorPlugin: EditorPlugin = {
    id: 'null-editor',
    use: (node) => node.schema.type === 'null',
    Editor: NullEditor
};
