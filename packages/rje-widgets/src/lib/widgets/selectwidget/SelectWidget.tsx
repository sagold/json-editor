import {
    widget,
    WidgetPlugin,
    StringNode,
    DefaultNodeOptions,
    WidgetProps,
    DecoratedWidgetProps
} from '@sagold/react-json-editor';
import { Select } from '../../components/select/Select';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { RadioGroup } from '../../components/radiogroup/RadioGroup';

export type SelectOptions = {
    type?: 'select' | 'radiogroup';
    /** set to true to render radiogroup in a single line */
    horizontal?: boolean;
} & DefaultNodeOptions;

export const selectDefaultOptions = {
    type: 'select'
};

export const SelectWidget = function (props: WidgetProps) {
    const type = (props.node.options?.type || props?.options?.type) ?? selectDefaultOptions.type;
    if (props.node.schema.format === 'radiogroup' || type === 'radiogroup') {
        return <RadioGroupWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    return <SelectOptionsWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
};

export const SelectOptionsWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];

    return (
        <WidgetField widgetType="select" node={node} options={options}>
            <Select
                id={node.id}
                title={options.title}
                placeholder={options.placeholder}
                required={options.required}
                error={hasError}
                disabled={options.disabled}
                selectedKey={node.value}
                setValue={setValue}
            >
                {enumValues.map((value, index) => (
                    <Select.Option key={value}>{titles[index] ?? value}</Select.Option>
                ))}
            </Select>
        </WidgetField>
    );
});

export const RadioGroupWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];

    return (
        <WidgetField widgetType="select" node={node} options={options}>
            <RadioGroup
                id={node.id}
                title={options.title}
                required={options.required}
                error={hasError}
                disabled={options.disabled}
                value={node.value}
                horizontal={options.horizontal}
                setValue={(value) => {
                    console.log('set value', typeof value, value);
                    setValue(value);
                }}
            >
                {enumValues.map((value, index) => (
                    <RadioGroup.Radio key={value} value={value}>
                        {titles[index] ?? value}
                    </RadioGroup.Radio>
                ))}
            </RadioGroup>
        </WidgetField>
    );
});

export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
    Widget: SelectWidget
};
