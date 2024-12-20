import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { PasswordInput, TextInput } from '@mantine/core';
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';
import { getSections } from './getSections';

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

export const StringWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    const Input = node.schema.format === 'password' ? PasswordInput : TextInput;
    const [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <Input
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
