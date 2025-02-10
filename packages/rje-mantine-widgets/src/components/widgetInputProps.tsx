import { Flex } from '@mantine/core';
import { WidgetMenu, WidgetMenuItems } from './widgetmenu/WidgetMenu';
import { Node, isParentNode } from '@sagold/react-json-editor';
import { WidgetDescription } from './WidgetDescription';

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
        id: node.id,
        disabled: disabled || isValidConst,
        error: node.errors.map((e) => e.message).join('\n'),
        readOnly: readOnly,
        required: required,
        withAsterisk: required && false,
        placeholder: placeholder
    };

    if ((showHeader !== false && title && title.length > 0) || (widgetMenuItems && widgetMenuItems?.length > 0)) {
        props.label = (
            <Flex style={{ width: '100%', height: '100%' }}>
                <span style={{ flexGrow: 1 }}>
                    {showHeader !== false && title}
                    {showHeader !== false && required && (
                        <span className={'rje-widget__asterisk'} aria-hidden>
                            *
                        </span>
                    )}
                </span>

                <WidgetMenu icon="more_horiz" readOnly={readOnly} items={widgetMenuItems} position="left" />
            </Flex>
        );

        // change layout of values-widgets to single line
        const menuWithoutTitle =
            showHeader === false ||
            ((title == null || title.length === 0) && widgetMenuItems && widgetMenuItems?.length > 0);
        if (menuWithoutTitle && !isParentNode(node)) {
            props.classNames = {
                root: 'rje-widget-menu',
                label: 'rje-widget-menu__label',
                wrapper: 'rje-widget-menu__wrapper'
            };
        }
    }
    if (description && description.length > 0) {
        props.description = <WidgetDescription text={description} />;
    }
    return props;
}
