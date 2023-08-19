import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { DatePicker, DatePickerProps } from '../../components/datepicker/DatePicker';
import { WidgetField } from '../../components/widgetfield/WidgetField';

export type DateOptions = {
    // icon?: string;
    // tag?: string;
    // swapIconPosition?: boolean;
    // format?: DatePickerProps['format'];
    // /* add increment/decrement buttons */
    // withButtons?: boolean;
} & DefaultNodeOptions;

export const DateWidget = widget<StringNode<DateOptions>, string>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    const format = node.schema.format;

    console.log('date widget data', node.value);

    return (
        <WidgetField widgetType="number" node={node} options={options}>
            <DatePicker
                disabled={options.disabled || isValidConst}
                error={hasError}
                onChange={(date) => {
                    if (format === 'date') {
                        setValue(date.toString());
                    } else {
                        // @ts-expect-error
                        setValue(date.toDate().toISOString());
                    }
                }}
                readOnly={options.readOnly}
                required={options.required}
                title={options.title}
                value={node.value}
                format={format as DatePickerProps['format']}
                // icon={options.icon}
                // iconPosition={options.swapIconPosition ? 'right' : 'left'}
                // id={node.id}
                // onPress={setValue}
                // placeholder={options.placeholder}
                // tag={options.tag}
                // defaultValue={node.value}
                // withButtons={options.withButtons}
            />
        </WidgetField>
    );
});

export const DateWidgetPlugin: WidgetPlugin = {
    id: 'date-widget',
    use: (node) =>
        (node.schema.type === 'string' && node.schema.format === 'date') || node.schema.format === 'date-time',
    Widget: DateWidget
};
