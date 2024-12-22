import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { ColorInput } from '@mantine/core';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';
import { useLiveUpdate } from './useLiveUpdate';
import { useCallback } from 'react';

export type ColorOptions = {
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
} & DefaultNodeOptions;

export const ColorWidget = widget<StringNode<ColorOptions>, string>(({ node, options, setValue }) => {
    const getValueFromEvent = useCallback((v: string) => v, []);
    const onUpdateProps = useLiveUpdate<string>(node.value ?? '', setValue, options.liveUpdate, getValueFromEvent);
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <ColorInput {...widgetInputProps(node, options)} {...onUpdateProps} />
        </WidgetField>
    );
});

export const ColorWidgetPlugin: WidgetPlugin = {
    id: 'color-widget',
    use: (node) => node.schema.type === 'string' && node.schema.format === 'hexColor',
    Widget: ColorWidget
};
