import { NumberNode } from 'headless-json-editor';
import { EditorPlugin } from '../types';
import { Form } from 'semantic-ui-react';
import { valueEditor } from './decorators';

export const NumberEditor = valueEditor<NumberNode>(({ node, setValue }) => (
    <div data-type="number">
        <Form.Input
            id={node.pointer}
            type="number"
            value={node.value}
            error={node.errors.length > 0 && node.errors.map((e) => e.message)}
            label={node.options.title}
            onChange={(e, { value }) => {
                const number = parseFloat(value);
                if (`${number}` === value) {
                    setValue(number);
                } else {
                    // @todo TYPE CHANGE BREAKS EVERYTHING
                    // should not change node type - should maintain expected type from schema
                    // @ts-ignore
                    setValue(value);
                }
            }}
        />
        {<div className="description">{node.options.description as string}</div>}
    </div>
));

export const NumberEditorPlugin: EditorPlugin = {
    id: 'number-editor',
    // @ts-ignore
    use: (node) => node.schema.type === 'number',
    // @ts-ignore
    Editor: NumberEditor
};
