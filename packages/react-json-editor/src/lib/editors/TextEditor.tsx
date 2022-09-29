import { StringNode } from 'headless-json-editor';
import { Form, Message } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import TextareaAutosize from 'react-textarea-autosize';

export const TextEditor = editor<StringNode, string>(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;
    return (
        <div data-type="string" data-id={node.pointer} className={disabled ? 'disabled' : 'enabled'}>
            <Form.Field error={node.errors.length > 0} disabled={options.disabled}>
                <label>{options.title as string}</label>
                <TextareaAutosize
                    id={node.id}
                    disabled={disabled}
                    rows={1}
                    minRows={2}
                    maxRows={10}
                    cacheMeasurements
                    value={node.value}
                    // onHeightChange={(height, instance) => console.log(height, instance)}
                    onChange={(e) => {
                        setValue(e.target.value || '');
                    }}
                />
            </Form.Field>
            {node.errors.length > 0 && (
                <Message error>
                    {node.errors.map((e) => (
                        <Message.Item key={e.message}>{e.message}</Message.Item>
                    ))}
                </Message>
            )}
            {<div className="description">{options.description as string}</div>}
        </div>
    );
});

export const TextEditorPlugin: EditorPlugin = {
    id: 'text-editor',
    use: (node) =>
        node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Editor: TextEditor
};
