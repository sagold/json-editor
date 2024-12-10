import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { Textarea } from '@mantine/core';
import { ReactNode } from 'react';
import { Icon } from '../components/icon/Icon';
import styles from './text-widget.module.scss';
import { widgetInputProps } from '../components/widgetInputProps';

export type StringOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
}>;

export const TextWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    let leftSection: ReactNode;
    let rightSection;
    if (options.icon) {
        if (options.swapIconPosition) {
            rightSection = <Icon>{options.icon}</Icon>;
        } else {
            leftSection = <Icon>{options.icon}</Icon>;
        }
    }
    if (options.tag) {
        if (!options.swapIconPosition) {
            rightSection = <span>{options.tag}</span>;
        } else {
            leftSection = <span>{options.tag}</span>;
        }
    }
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <Textarea
                id={node.id}
                {...widgetInputProps(node, options)}
                autosize
                classNames={{ section: styles['section__icon'] }}
                leftSection={leftSection}
                onChange={(e) => setValue(e.currentTarget.value)}
                rows={1}
                maxRows={20}
                rightSection={rightSection}
                value={node.value}
            />
        </WidgetField>
    );
});

export const TextWidgetPlugin: WidgetPlugin = {
    id: 'text-widget',
    use: (node) => node.schema.type === 'string' && node.schema.format === 'textarea',
    Widget: TextWidget
};
