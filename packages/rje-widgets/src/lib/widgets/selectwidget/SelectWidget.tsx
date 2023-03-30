import { widget, WidgetPlugin, StringNode } from '@sagold/react-json-editor';
import { Select } from '../../components/select/Select';
import { WidgetField } from '../../components/widgetfield/WidgetField';

export const SelectWidget = widget<StringNode, string | number>(({ node, options, setValue }) => {
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

export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
    Widget: SelectWidget
};
