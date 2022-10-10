import { NumberNode } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
import { Form } from 'semantic-ui-react';
import { widget } from './decorators';

export const NumberWidget = widget<NumberNode, number>(({ node, options, setValue }) => (
    <div className="ed-form ed-value" data-type="number" data-id={node.pointer}>
        <Form.Input
            error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
            label={options.title}
            id={node.id}
            type="number"
            // labelPosition="right"
            // label={{ basic: true, content: '%' }}
            value={node.value}
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
        ></Form.Input>
        {/*{node.errors.length > 0 && (
            <Message error>
                <Message.List>
                    {node.errors.map((e) => {
                        return <Message.Item key={e.message}>{e.message}</Message.Item>;
                    })}
                </Message.List>
            </Message>
        )}*/}
        {options.description && <em className="ed-description">{options.description}</em>}
    </div>
));

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
