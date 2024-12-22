import {
    widget,
    WidgetPlugin,
    StringNode,
    DefaultNodeOptions,
    WidgetField,
    WidgetProps,
    DecoratedWidgetProps
} from '@sagold/react-json-editor';
import { Chip, ChipProps, Group, InputWrapper, Radio, Select, Stack } from '@mantine/core';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';

export type SelectOptions = {
    type?: 'select' | 'taglist';
    /** chip variant for taglist */
    variant?: ChipProps['variant'];
    /** set to true to render radiogroup in a single line */
    horizontal?: boolean;
    loading?: boolean;

    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
} & DefaultNodeOptions;

export const selectDefaultOptions = {
    type: 'select'
};

export const SelectWidget = function (props: WidgetProps) {
    const type = (props.node.options?.type || props?.options?.type) ?? selectDefaultOptions.type;
    if (props.node.schema.format === 'radiogroup' || type === 'radiogroup') {
        return <RadioGroupWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    if (props.node.schema.format === 'taglist' || type === 'taglist') {
        return <TagListWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    return <SelectOptionsWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
};

export const TagListWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];
    const hasError = node.errors.length > 0;

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <InputWrapper {...widgetInputProps(node, options)}>
                <Chip.Group multiple={false} value={node.value} onChange={setValue}>
                    <Group
                        style={{
                            paddingTop: 'calc(var(--mantine-spacing-xs) / 2)'
                        }}
                    >
                        {enumValues.map((value, index) => (
                            <Chip
                                key={value}
                                className={hasError ? 'rje-chip--error' : undefined}
                                value={value}
                                disabled={options.disabled}
                                variant={options.variant}
                            >
                                {titles[index] ?? value}
                            </Chip>
                        ))}
                    </Group>
                </Chip.Group>
            </InputWrapper>
        </WidgetField>
    );
});

const RadioGroupWidget = widget<StringNode<SelectOptions>, string | number>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];
    const hasError = node.errors.length > 0;

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <Radio.Group id={node.id} {...widgetInputProps(node, options)} value={node.value} onChange={setValue}>
                <Stack gap={8} pt={'calc(var(--mantine-spacing-xs) / 2)'}>
                    {enumValues.map((value, index) => (
                        <Radio
                            key={value}
                            value={value}
                            label={titles[index] ?? value}
                            disabled={options.disabled}
                            error={hasError}
                        />
                    ))}
                </Stack>
            </Radio.Group>
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
                {...widgetInputProps(node, options)}
                data={enumValues.map((value, index) => ({ value, label: titles[index] ?? value }))}
                onChange={(value) => value && setValue(value)}
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
