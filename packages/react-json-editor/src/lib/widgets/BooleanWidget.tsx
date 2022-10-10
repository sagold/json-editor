import { Form, Checkbox } from 'semantic-ui-react';
import { BooleanNode } from 'headless-json-editor';
import { WidgetPlugin, widget } from './decorators';

export const BooleanWidget = widget<BooleanNode, boolean>(({ node, options, setValue }) => (
    <div className="ed-form ed-value" data-type="boolean" data-id={node.pointer}>
        <Form.Field id={node.id} error={node.errors.length > 0 && node.errors.map((e) => e.message)}>
            <Checkbox
                label={options.title as string}
                checked={node.value}
                onChange={(e, { checked }) => setValue(checked === true)}
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
