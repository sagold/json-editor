import { Chip, Group, InputWrapper, MultiSelect } from '@mantine/core';
import {
    widget,
    WidgetPlugin,
    ArrayNode,
    DefaultNodeOptions,
    getData,
    WidgetField,
    WidgetProps,
    DecoratedWidgetProps
} from '@sagold/react-json-editor';

export type SelectMultipleOptions = DefaultNodeOptions;

const MultiSelectWidget = (props: WidgetProps) => {
    const type = (props.node.options?.type || props?.options?.type) ?? 'select';
    if (props.node.schema.format === 'taglist' || type === 'taglist') {
        return <TagListWidget {...(props as DecoratedWidgetProps<ArrayNode, string>)} />;
    }
    return <SelectWidget {...(props as DecoratedWidgetProps<ArrayNode, string>)} />;
};

const SelectWidget = widget<ArrayNode<SelectMultipleOptions>, string[]>(({ node, options, setValue }) => {
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

const TagListWidget = widget<ArrayNode<SelectMultipleOptions>, string[]>(({ node, options, setValue }) => {
    const value = getData(node) as string[];
    // @ts-expect-error unknown schema
    const enumValues = (node.schema.items.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];
    const data = enumValues.map((id) => ({ value: id, label: titles[id] ?? id }));

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <InputWrapper
                id={node.id}
                label={options.title}
                description={options.description}
                required={options.required}
                error={node.errors.map((e) => e.message).join('\n')}
            >
                <Chip.Group multiple={true} value={value} onChange={setValue}>
                    <Group
                        style={{
                            paddingTop: 'calc(var(--mantine-spacing-xs) / 2)'
                        }}
                    >
                        {data.map(({ value, label }) => (
                            <Chip key={value} value={value} disabled={options.disabled}>
                                {label}
                            </Chip>
                        ))}
                    </Group>
                </Chip.Group>
            </InputWrapper>
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
