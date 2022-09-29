import { EditorPlugin } from './decorators';
import { json, Node } from 'headless-json-editor';

export const UnknownEditor = ({ node }: { node: Node }) => (
    <div data-type="unknown" data-id={node.pointer} style={{ background: 'rgb(208, 120, 132)', padding: '8px' }}>
        <b>unknown editor for node '{node.schema.type as string}'</b>
        <input value={JSON.stringify(json(node))} />
        {<p>{JSON.stringify({ ...node }, null, 2)}</p>}
    </div>
);

export const UnknownEditorPlugin: EditorPlugin = {
    id: 'unknown-editor',
    use: () => true,
    Editor: UnknownEditor
};
