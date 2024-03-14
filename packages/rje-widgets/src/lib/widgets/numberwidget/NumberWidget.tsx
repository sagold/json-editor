import { widget, WidgetPlugin, NumberNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { NumberInput } from '../../components/input/NumberInput';
import { WidgetField } from '../../components/widgetfield/WidgetField';

type NumberOptions = {
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
    format?: Intl.NumberFormatOptions;
    /* add increment/decrement buttons */
    withButtons?: boolean;
} & DefaultNodeOptions;


export const NumberWidget = widget<NumberNode<NumberOptions>, number | null>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;

    return (
        <WidgetField widgetType="number" node={node} options={options}>
            <NumberInput
                disabled={options.disabled || isValidConst}
                error={hasError}
                format={options.format}
                icon={options.icon}
                iconPosition={options.swapIconPosition ? 'right' : 'left'}
                id={node.id}
                onPress={(value) => setValue(isNaN(value) ? null : value)}
                placeholder={options.placeholder}
                readOnly={options.readOnly}
                required={options.required}
                tag={options.tag}
                title={options.title}
                value={node.value}
                defaultValue={node.value}
                withButtons={options.withButtons}
            />
        </WidgetField>
    );
});

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
