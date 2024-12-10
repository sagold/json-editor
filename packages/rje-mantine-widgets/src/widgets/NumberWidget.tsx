import { widget, WidgetPlugin, DefaultNodeOptions, WidgetField, NumberNode } from '@sagold/react-json-editor';
import { NumberInput } from '@mantine/core';
import { ReactNode } from 'react';
import { Icon } from '../components/icon/Icon';
import { widgetInputProps } from '../components/widgetInputProps';

export type NumberOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
}>;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => {
    const type = node.schema.format === 'password' ? 'password' : 'text';
    let leftSection: ReactNode;
    let rightSection: ReactNode;
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
            <NumberInput
                id={node.id}
                {...widgetInputProps(node, options)}
                leftSection={leftSection}
                onChange={(value) => setValue(+value)}
                rightSection={rightSection}
                type={type}
                value={node.value}
            />
        </WidgetField>
    );
});

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
