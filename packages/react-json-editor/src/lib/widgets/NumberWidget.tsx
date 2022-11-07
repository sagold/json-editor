import { NumberNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
import { Form, SemanticICONS, Input /*, SemanticShorthandItem, LabelProps*/ } from 'semantic-ui-react';
import { widget } from './decorators';
import { useCallback } from 'react';

type NumberOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    // label?: SemanticShorthandItem<LabelProps>;
    // labelPosition?: 'left' | 'right' | 'right corner' | 'left corner';
} & DefaultNodeOptions;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => {
    const onChange = useCallback(
        (event: FocusEvent | React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target?.value;
            const number = parseFloat(value);
            if (`${number}` === value) {
                setValue(number);
            } else {
                // @todo TYPE CHANGE BREAKS EVERYTHING
                // should not change node type - should maintain expected type from schema
                // @ts-ignore
                setValue(value);
            }
        },
        [setValue]
    );

    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };

    return (
        <div className="ed-form ed-value" data-type="number" data-id={node.pointer}>
            <Form.Input
                disabled={options.disabled === true}
                error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
                id={node.id}
                inline={options.inline === true}
                label={options.title}
                required={options.required === true}
            >
                <Input
                    defaultValue={node.value}
                    disabled={options.disabled === true}
                    icon={options.icon}
                    iconPosition={options.iconPosition}
                    id={node.id}
                    placeholder={options.placeholder}
                    readOnly={options.readOnly === true}
                    required={options.required === true}
                    type="number"
                    {...changeListener}
                />
            </Form.Input>
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
