import { MultiSelect } from '@mantine/core';
import { widget, WidgetPlugin, ArrayNode, DefaultNodeOptions, getData, WidgetField } from '@sagold/react-json-editor';

export type SelectMultipleOptions = DefaultNodeOptions;

export const MultiSelectWidget = widget<ArrayNode<SelectMultipleOptions>, string[]>(({ node, options, setValue }) => {
    // @ts-expect-error unknown schema
    const enumValues = (node.schema.items.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];
    const data = enumValues.map((id) => ({ value: id, label: titles[id] ?? id }));

    return (
        <WidgetField
            widgetType="select-multiple"
            node={node}
            options={options}
            showError={false}
            showDescription={false}
        >
            <MultiSelect
                id={node.id}
                data={data}
                description={options.description}
                disabled={options.disabled}
                readOnly={options.readOnly}
                error={node.errors.map((e) => e.message).join('\n')}
                label={options.title}
                onChange={setValue}
                placeholder={options.placeholder}
                required={options.required}
                value={getData(node) as string[]}
                withAsterisk={options.required}
            />
        </WidgetField>
    );
});

export const MultiSelectWidgetPlugin: WidgetPlugin = {
    id: 'select-multiple-widget',
    use: (node) =>
        // @ts-expect-error unknown schema
        node.schema.items?.type === 'string' && node.schema.uniqueItems && Array.isArray(node.schema.items?.enum),
    Widget: MultiSelectWidget
};
