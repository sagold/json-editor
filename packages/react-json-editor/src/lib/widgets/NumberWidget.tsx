import { NumberNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
import { Form, SemanticICONS, SemanticShorthandItem, LabelProps } from 'semantic-ui-react';
import { widget } from './decorators';

type NumberOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    // label?: SemanticShorthandItem<LabelProps>;
    // labelPosition?: 'left' | 'right' | 'right corner' | 'left corner';
} & DefaultNodeOptions;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => (
    <div className="ed-form ed-value" data-type="number" data-id={node.pointer}>
        <Form.Input
            error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
            label={options.title}
            // label={options.label ?? options.title}
            // labelPosition={options.labelPosition}
            id={node.id}
            type="number"
            inline={options.inline === true}
            icon={options.icon}
            iconPosition={options.iconPosition}
            placeholder={options.placeholder}
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
        {options.description && <em className="ed-description">{options.description}</em>}
    </div>
));

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
