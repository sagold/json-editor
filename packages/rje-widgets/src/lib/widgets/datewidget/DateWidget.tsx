import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { DatePicker, DatePickerProps } from '../../components/datepicker/DatePicker';
import { TimeInput } from '../../components/timeinput/TimeInput';
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

    if (format === 'time') {
        return (
            <WidgetField widgetType="date" node={node} options={options}>
                <TimeInput
                    disabled={options.disabled || isValidConst}
                    error={hasError}
                    onChange={(time) => {
                        setValue(time?.toString ? time.toString() : '');
                    }}
                    // readOnly={options.readOnly}
                    required={options.required}
                    title={options.title ?? node.id}
                    value={node.value}
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
    }

    return (
        <WidgetField widgetType="date" node={node} options={options}>
            <DatePicker
                disabled={options.disabled || isValidConst}
                error={hasError}
                onChange={(date) => {
                    if (!date) {
                        return setValue("");
                    }
                    if (format === 'date') {
                        return setValue(date.toString());
                    }
                    // @ts-expect-error
                    setValue(date.toDate().toISOString());
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

const isHHmmsss = /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)$/;

export const DateWidgetPlugin: WidgetPlugin = {
    id: 'date-widget',
    use: (node) => {
        if (node.schema.type !== 'string') {
            return false;
        }
        // @ts-ignore
        const value = node.value;
        if (node.schema.format === 'time' && (value === '' || isHHmmsss.test(value))) {
            return true;
        }

        return node.schema.format === 'date' || node.schema.format === 'date-time';
    },

    Widget: DateWidget
};
