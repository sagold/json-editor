import { StringNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import TextareaAutosize from 'react-textarea-autosize';

export const TextEditor = editor<StringNode, string>(({ node, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = node.options.disabled || isValidConst;
    return (
        <div data-type="string" data-id={node.pointer} className={disabled ? 'disabled' : 'enabled'}>
            <Form.Field
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
                disabled={node.options.disabled}
            >
                <label>{node.options.title as string}</label>
                <TextareaAutosize
                    id={node.id}
                    disabled={disabled}
                    rows={1}
                    minRows={2}
                    maxRows={10}
                    cacheMeasurements
                    value={node.value}
                    onHeightChange={(height, instance) => console.log(height, instance)}
                    onChange={(e) => {
                        setValue(e.target.value || '');
                    }}
                />
            </Form.Field>
            {<div className="description">{node.options.description as string}</div>}
        </div>
    );
});

export const TextEditorPlugin: EditorPlugin = {
    id: 'text-editor',
    use: (node) =>
        node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Editor: TextEditor
};
