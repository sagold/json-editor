import { WidgetPlugin } from '@sagold/react-json-editor';
import { json, Node } from 'headless-json-editor';

export const UnknownWidget = ({ node }: { node: Node }) => (
    <div data-type="unknown" data-id={node.pointer} style={{ background: 'rgb(208, 120, 132)', padding: '8px' }}>
        <b>unknown widget for node '{node.schema.type as string}'</b>
        <input value={JSON.stringify(json(node))} />
        {<p>{JSON.stringify({ ...node }, null, 2)}</p>}
    </div>
);

export const UnknownWidgetPlugin: WidgetPlugin = {
    id: 'unknown-widget',
    use: () => true,
    Widget: UnknownWidget
};
