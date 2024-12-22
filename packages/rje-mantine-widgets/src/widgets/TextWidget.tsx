import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { Textarea } from '@mantine/core';
import styles from './text-widget.module.scss';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';
import { getSections } from './getSections';
import { useLiveUpdate } from './useLiveUpdate';

export type StringOptions = DefaultNodeOptions<{
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

export const TextWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    const [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    const onUpdateProps = useLiveUpdate<string>(node.value ?? '', setValue, options.liveUpdate);

    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <Textarea
                {...widgetInputProps(node, options)}
                {...onUpdateProps}
                autosize
                classNames={{ section: styles['section__icon'] }}
                leftSection={leftSection}
                rows={1}
                maxRows={20}
                rightSection={rightSection}
            />
        </WidgetField>
    );
});

export const TextWidgetPlugin: WidgetPlugin = {
    id: 'text-widget',
    use: (node) => node.schema.type === 'string' && node.schema.format === 'textarea',
    Widget: TextWidget
};
