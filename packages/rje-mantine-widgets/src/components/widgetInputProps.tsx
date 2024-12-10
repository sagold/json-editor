import { Flex } from '@mantine/core';
import { WidgetMenu, WidgetMenuItems } from './widgetmenu/WidgetMenu';
import { Node } from '@sagold/react-json-editor';
import { Description } from './Description';

export type WidgetInputOptions = {
    description?: string;
    disabled?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    showHeader?: boolean;
    title?: string;
    widgetMenuItems?: WidgetMenuItems;
};

export function widgetInputProps(
    node: Node,
    { showHeader, title, description, required, disabled, readOnly, placeholder, widgetMenuItems }: WidgetInputOptions
) {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const props: Record<string, any> = {
        disabled: disabled || isValidConst,
        error: node.errors.map((e) => e.message).join('\n'),
        readOnly: readOnly,
        required: required,
        withAsterisk: required,
        placeholder: placeholder
    };
    if ((showHeader !== false && title && title.length > 0) || (widgetMenuItems && widgetMenuItems?.length > 0)) {
        props.label = (
            <Flex>
                <span style={{ flexGrow: 1 }}>{showHeader !== false && title}</span>
                <WidgetMenu icon="more_horiz" items={widgetMenuItems} />
            </Flex>
        );
    }
    if (description && description.length > 0) {
        props.description = <Description text={description} />;
    }
    return props;
}
