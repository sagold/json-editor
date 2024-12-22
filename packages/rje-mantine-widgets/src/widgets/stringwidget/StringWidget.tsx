import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { ActionIcon, PasswordInput, TextInput } from '@mantine/core';
import { widgetInputProps } from '../../components/widgetInputProps';
import { WidgetMenuItems } from '../../components/widgetmenu/WidgetMenu';
import { getSections } from '../getSections';
import { useLiveUpdate } from '../useLiveUpdate';
import { ChangeEvent, useCallback } from 'react';
import { Icon } from '../../components/icon/Icon';

export type StringOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if true, shows a clear input action */
    clearable?: boolean;
    /** icon to display on left side of input field */
    icon?: string;
    /** short string to display on right side of input field */
    tag?: string;
    /** swap placement of icon and label */
    swapIconPosition?: boolean;
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
}>;

const getValueFromEvent = (event: ChangeEvent<HTMLInputElement>) => event.currentTarget.value;

export const StringWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    const Input = node.schema.format === 'password' ? PasswordInput : TextInput;
    const onUpdateProps = useLiveUpdate<string>(node.value ?? '', setValue, getValueFromEvent, options.liveUpdate);
    const clearValue = useCallback(() => setValue(''), [setValue]);
    // eslint-disable-next-line prefer-const
    let [leftSection, rightSection] = getSections(options.icon, options.tag, options.swapIconPosition);
    if (options.clearable && onUpdateProps.value !== '') {
        rightSection = (
            <ActionIcon variant="subtle" disabled={options.disabled} color="gray" onClick={clearValue}>
                <Icon>clear</Icon>
            </ActionIcon>
        );
    }

    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <Input
                {...widgetInputProps(node, options)}
                {...onUpdateProps}
                leftSection={leftSection}
                rightSection={rightSection}
            />
        </WidgetField>
    );
});

export const StringWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'string',
    Widget: StringWidget
};
