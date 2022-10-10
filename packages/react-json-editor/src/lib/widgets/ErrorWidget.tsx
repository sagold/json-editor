import { JSONError } from 'json-schema-library';
import { WidgetPlugin } from './decorators';
import { json, Node, isJSONError, HeadlessJsonEditor } from 'headless-json-editor';
import { Form, Button, Icon } from 'semantic-ui-react';

export const ErrorWidget = ({ node, instance }: { node: Node; instance: HeadlessJsonEditor }) => {
    const value = JSON.stringify(json(node));
    const error = node.schema as unknown as JSONError;
    const description = `${error.name} '${node.pointer}': ${error.message}`;
    return (
        <div className="ed-form" data-type="error" data-id={node.pointer}>
            <Form.Input
                id={node.id}
                type="text"
                readOnly
                value={value}
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
                label={`${node.property} (${error.name})`}
            />
            <Button basic icon onClick={() => instance.removeValue(node.pointer)}>
                <Icon name="trash alternate outline" />
            </Button>
            {description && <em className="ed-description">{description}</em>}
            {
                <p style={{ background: 'rgb(208, 120, 132)', padding: '8px' }}>
                    {JSON.stringify({ ...node.schema }, null, 2)}
                </p>
            }
        </div>
    );
};

export const ErrorWidgetPlugin: WidgetPlugin = {
    id: 'error-widget',
    use: (node) => isJSONError(node.schema),
    Widget: ErrorWidget
};
