import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { PasswordInput, TextInput } from '@mantine/core';
import { ReactNode } from 'react';
import { Icon } from '../components/icon/Icon';
import { widgetInputProps } from '../components/widgetInputProps';

export type StringOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
}>;

export const StringWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
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

    const Input = node.schema.format === 'password' ? PasswordInput : TextInput;

    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <Input
                id={node.id}
                {...widgetInputProps(node, options)}
                leftSection={leftSection}
                onChange={(e) => setValue(e.currentTarget.value)}
                rightSection={rightSection}
                value={node.value}
            />
        </WidgetField>
    );
});

export const StringWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'string',
    Widget: StringWidget
};
