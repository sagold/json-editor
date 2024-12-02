import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { Select } from '@mantine/core';

export type SelectOptions = {
    type?: 'select' | 'radiogroup' | 'taglist';
    /** set to true to render radiogroup in a single line */
    horizontal?: boolean;
    loading?: boolean;
} & DefaultNodeOptions;

export const selectDefaultOptions = {
    type: 'select'
};

export const SelectOptionsWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <Select
                id={node.id}
                label={options.title}
                description={options.description}
                placeholder={options.placeholder}
                required={options.required}
                error={node.errors.map((e) => e.message).join('\n')}
                disabled={options.disabled}
                value={node.value}
                onChange={(value) => value && setValue(value)}
                data={enumValues.map((value, index) => ({
                    value,
                    label: titles[index] ?? value
                }))}
            ></Select>
        </WidgetField>
    );
});

export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
    Widget: SelectOptionsWidget
};
