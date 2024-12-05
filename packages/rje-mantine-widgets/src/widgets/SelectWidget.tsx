import {
    widget,
    WidgetPlugin,
    StringNode,
    DefaultNodeOptions,
    WidgetField,
    WidgetProps,
    DecoratedWidgetProps
} from '@sagold/react-json-editor';
import { Chip, Group, InputWrapper, Select } from '@mantine/core';
import { Description } from '../components/Description';

export type SelectOptions = {
    type?: 'select' | 'taglist';
    /** set to true to render radiogroup in a single line */
    horizontal?: boolean;
    loading?: boolean;
} & DefaultNodeOptions;

export const selectDefaultOptions = {
    type: 'select'
};

export const SelectWidget = function (props: WidgetProps) {
    const type = (props.node.options?.type || props?.options?.type) ?? selectDefaultOptions.type;
    // if (props.node.schema.format === 'radiogroup' || type === 'radiogroup') {
    //     return <RadioGroupWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    // }
    if (props.node.schema.format === 'taglist' || type === 'taglist') {
        return <TagListWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    return <SelectOptionsWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
};

export const TagListWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <InputWrapper
                id={node.id}
                label={options.title}
                description={<Description text={options.description} />}
                required={options.required}
                error={node.errors.map((e) => e.message).join('\n')}
            >
                <Chip.Group multiple={false} value={node.value} onChange={setValue}>
                    <Group
                        style={{
                            paddingTop: 'calc(var(--mantine-spacing-xs) / 2)'
                        }}
                    >
                        {enumValues.map((value, index) => (
                            <Chip key={value} value={value} disabled={options.disabled}>
                                {titles[index] ?? value}
                            </Chip>
                        ))}
                    </Group>
                </Chip.Group>
            </InputWrapper>
        </WidgetField>
    );
});

export const SelectOptionsWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <Select
                id={node.id}
                data={enumValues.map((value, index) => ({ value, label: titles[index] ?? value }))}
                description={<Description text={options.description} />}
                disabled={options.disabled}
                error={node.errors.map((e) => e.message).join('\n')}
                label={options.title}
                onChange={(value) => value && setValue(value)}
                placeholder={options.placeholder}
                required={options.required}
                value={node.value}
            ></Select>
        </WidgetField>
    );
});

export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) =>
        (node.schema.type?.includes?.('string') || node.schema.type === 'string') && Array.isArray(node.schema.enum),
    Widget: SelectWidget
};
