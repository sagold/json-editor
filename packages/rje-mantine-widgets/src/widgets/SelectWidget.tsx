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

/**
 * JSON Schema string-enum options
 *
 * @example
 * {
 *    "type": "string",
 *    "enum": ["month", "quarter", "year"],
 *    "x-options": {
 *       "showHeader": false
 *    }
 * }
 */
export type SelectOptions = DefaultNodeOptions & {
    /** list of titles for the JSON Schema enum options - matched by index */
    enum?: string[];
    /** chip variant for taglist */
    variant?: ChipProps['variant'];
    /** set to true to render radiogroup in a single line */
    horizontal?: boolean;
    loading?: boolean;

    /**
     * if false, will hide title. will hide complete title-header if no menu-actions are available
     */
    showHeader?: boolean;

    /**
     * @internal option for menu action items
     */
    widgetMenuItems?: WidgetMenuItems;
};

export const SelectWidget = function (props: WidgetProps) {
    if (props.node?.schema['x-widget'] === 'select:radiogroup') {
        return <RadioGroupWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    if (props.node?.schema['x-widget'] === 'select:taglist') {
        return <TagListWidget {...(props as DecoratedWidgetProps<StringNode, boolean>)} />;
    }
    // schema['x-widget'] === 'select'
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

/**
 * Select Widget will render a JSON Schema `type: "string", enum: [string]` as a selection.
 *
 * Three select components are available and you can choose between each type using the `x-widget` property:
 *
 * - per default it will render as normal select input
 * - `x-widget: "select:taglist` will render a horizontal options represented as tags to be selected directly
 * - `x-widget: "select:radiogroup` will render a vertical radiogroup with all options visible
 *
 * @example
 * {
 *  "type": "string",
 *  "enum": ["month", "quarter", "year"],
 *  "x-widget": "select:radiogroup"
 * }
 */
export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) =>
        (node.schema.type?.includes?.('string') || node.schema.type === 'string') && Array.isArray(node.schema.enum),
    Widget: SelectWidget
};
