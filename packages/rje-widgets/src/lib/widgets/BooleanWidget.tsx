import { Form, Checkbox } from 'semantic-ui-react';
import { BooleanNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin, widget } from '@sagold/react-json-editor';

export type BooleanOptions = {
    type?: 'checkbox' | 'toggle';
} & DefaultNodeOptions;

export const booleanDefaultOptions = {
    type: 'toggle'
};

export const BooleanWidget = widget<BooleanNode<BooleanOptions>, boolean>(({ node, options, setValue }) => (
    <div className="ed-form ed-value" data-type="boolean" data-id={node.pointer}>
        <Form.Field id={node.id} error={node.errors.length > 0 && node.errors.map((e) => e.message)}>
            <Checkbox
                checked={node.value}
                label={options.title as string}
                onChange={(e, { checked }) => setValue(checked === true)}
                readOnly={options.readOnly === true}
                toggle={options.type ? options.type === 'toggle' : booleanDefaultOptions.type === 'toggle'}
            />
        </Form.Field>
        {options.description && <em className="ed-description">{options.description}</em>}
    </div>
));

export const BooleanWidgetPlugin: WidgetPlugin = {
    id: 'boolean-widget',
    use: (node) => node.schema.type === 'boolean',
    Widget: BooleanWidget
};
