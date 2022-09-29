import { EditorPlugin } from '../types';
import { json, Node, isJsonError, JST } from '@sagold/headless-json-editor';
import { Form, Button, Icon } from 'semantic-ui-react';

export const ErrorEditor = ({ node, instance }: { node: Node; instance: JST }) => {
    const value = JSON.stringify(json(node));
    const description = `${node.schema.name} '${node.pointer}': ${node.schema.message}`;
    return (
        <div data-type="error">
            <Form.Input
                id={node.pointer}
                type="text"
                readOnly
                value={value}
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
                label={`${node.property} (${node.schema.name})`}
            />
            <Button basic icon onClick={() => instance.remove(node.pointer)}>
                <Icon name="trash alternate outline" />
            </Button>
            <p style={{ color: 'rgb(208, 120, 132)', marginTop: 0 }} className="description">
                {description}
            </p>
            {
                <p style={{ background: 'rgb(208, 120, 132)', padding: '8px' }}>
                    {JSON.stringify({ ...node.schema }, null, 2)}
                </p>
            }
        </div>
    );
};

export const ErrorEditorPlugin: EditorPlugin = {
    id: 'error-editor',
    use: (node) => isJsonError(node.schema),
    Editor: ErrorEditor
};
