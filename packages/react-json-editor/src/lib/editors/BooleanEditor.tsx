import { Form, Checkbox } from 'semantic-ui-react';
import { BooleanNode } from 'headless-json-editor';
import { EditorPlugin, editor } from './decorators';

export const BooleanEditor = editor<BooleanNode, boolean>(({ node, setValue }) => (
    <div data-type="boolean" data-id={node.pointer}>
        <Form.Field id={node.id} error={node.errors.length > 0 && node.errors.map((e) => e.message)}>
            <Checkbox
                label={node.options.title as string}
                checked={node.value}
                onChange={(e, { checked }) => setValue(checked === true)}
            />
        </Form.Field>
        {<div className="description">{node.options.description as string}</div>}
    </div>
));

export const BooleanEditorPlugin: EditorPlugin = {
    id: 'boolean-editor',
    use: (node) => node.schema.type === 'boolean',
    Editor: BooleanEditor
};
