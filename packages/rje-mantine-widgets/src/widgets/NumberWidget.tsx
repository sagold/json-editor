import { widget, WidgetPlugin, DefaultNodeOptions, WidgetField, NumberNode } from '@sagold/react-json-editor';
import { NumberInput } from '@mantine/core';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';
import { useLiveUpdate } from './useLiveUpdate';
import { getSections } from './getSections';
import { useCallback } from 'react';

export type NumberOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
}>;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => {
    const getValueFromEvent = useCallback((v: string) => +v, []);
    const onUpdateProps = useLiveUpdate<number>(node.value ?? 0, setValue, options.liveUpdate, getValueFromEvent);
    const [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <NumberInput
                id={node.id}
                {...widgetInputProps(node, options)}
                {...onUpdateProps}
                leftSection={leftSection}
                rightSection={rightSection}
            />
        </WidgetField>
    );
});

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
