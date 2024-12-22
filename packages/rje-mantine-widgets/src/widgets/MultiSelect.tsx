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
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';
import { useLiveUpdate } from './useLiveUpdate';
import { useCallback } from 'react';

export type SelectMultipleOptions = {
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
} & DefaultNodeOptions;

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
    const getValueFromEvent = useCallback((value: string[]) => value, []);
    const onUpdateProps = useLiveUpdate<string[]>(
        getData(node) as string[],
        setValue,
        options.liveUpdate,
        getValueFromEvent
    );

    return (
        <WidgetField
            widgetType="select-multiple"
            node={node}
            options={options}
            showError={false}
            showDescription={false}
        >
            <MultiSelect {...widgetInputProps(node, options)} data={data} {...onUpdateProps} />
        </WidgetField>
    );
});

const TagListWidget = widget<ArrayNode<SelectMultipleOptions>, string[]>(({ node, options, setValue }) => {
    // @ts-expect-error unknown schema
    const enumValues = (node.schema.items.enum || []) as string[];
    const titles = (options.enum as string[]) ?? [];
    const data = enumValues.map((id) => ({ value: id, label: titles[id] ?? id }));
    const onUpdateProps = useLiveUpdate<string[]>(
        getData(node) as string[],
        setValue,
        options.liveUpdate,
        (value: string[]) => value
    );

    return (
        <WidgetField widgetType="select" node={node} options={options} showDescription={false} showError={false}>
            <InputWrapper {...widgetInputProps(node, options)}>
                <Chip.Group multiple={true} {...onUpdateProps}>
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
