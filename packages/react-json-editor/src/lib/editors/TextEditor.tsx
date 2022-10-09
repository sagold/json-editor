import { StringNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import TextareaAutosize from 'react-textarea-autosize';

export const TextEditor = editor<StringNode, string>(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;
    return (
        <div
            className={`ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Field
                disabled={options.disabled}
                control={TextareaAutosize}
                id={node.id}
                rows={1}
                minRows={2}
                maxRows={10}
                cacheMeasurements
                value={node.value}
                error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
                label={options.title}
                onChange={(e) => {
                    setValue(e.target.value || '');
                }}
            ></Form.Field>
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const TextEditorPlugin: EditorPlugin = {
    id: 'text-editor',
    use: (node) =>
        node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Editor: TextEditor
};
