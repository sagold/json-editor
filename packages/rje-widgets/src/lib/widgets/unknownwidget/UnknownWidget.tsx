import { WidgetPlugin } from '@sagold/react-json-editor';
import { json, Node } from '@sagold/react-json-editor';
import { Form } from 'semantic-ui-react';

export const UnknownWidget = ({ node }: { node: Node }) => (
    <div
        data-type="unknown"
        data-id={node.pointer}
        style={{ background: 'rgba(208, 120, 132, 0.1)', border: '1px solid rgba(208, 120, 132, 1)', padding: '8px' }}
    >
        <Form.Field
            id={node.id}
            error={node.errors.length > 0 && node.errors.map((e) => e.message)}
            style={{ display: 'flex', alignItems: 'center' }}
            disabled={node.options.disabled}
        >
            <label>Unknown widget for node at '{node.pointer}'</label>
        </Form.Field>
        <em className="ed-description">{JSON.stringify({ ...node }, null, 2)}</em>
    </div>
);

export const UnknownWidgetPlugin: WidgetPlugin = {
    id: 'unknown-widget',
    use: () => true,
    Widget: UnknownWidget
};
