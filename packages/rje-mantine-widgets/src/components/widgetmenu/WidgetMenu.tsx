import { ActionIcon, DefaultMantineColor, Menu, MenuItemProps, MenuProps } from '@mantine/core';
import { Icon } from '../icon/Icon';

export type WidgetMenuItem = {
    icon?: string;
    label: string;
    onClick: () => void;
    color?: DefaultMantineColor;
    closeMenuOnClick?: boolean;
    disabled?: boolean;
} & MenuItemProps;

export type WidgetMenuItems = (WidgetMenuItem | '-' | string)[];

export type WidgetMenuProps = {
    icon: string;
    disabled?: boolean;
    readOnly?: boolean;
    inline?: boolean;
    items?: WidgetMenuItems;
} & MenuProps;

export function WidgetMenu({ icon, disabled, inline = true, readOnly, items, ...menuProps }: WidgetMenuProps) {
    if (items == null || items.length === 0 || readOnly) {
        return null;
    }

    const allItemsDisabled = items.find((item) => typeof item !== 'string' && item.disabled !== true) == null;

    return (
        <Menu {...menuProps}>
            <Menu.Target>
                <ActionIcon
                    variant="subtle"
                    disabled={allItemsDisabled || disabled}
                    color="gray"
                    // we use the menu-action within labels, ensure it respects the initial height
                    style={inline ? { height: '100%', minHeight: 'inherit' } : {}}
                >
                    <Icon>{icon}</Icon>
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {items.map((item, index) => {
                    if (item === '-') {
                        return <Menu.Divider key={index} />;
                    }
                    if (typeof item === 'string') {
                        return <Menu.Label key={index}>{item}</Menu.Label>;
                    }
                    const leftSection = item.icon ? <Icon>{item.icon}</Icon> : null;
                    return (
                        <Menu.Item key={index} {...item} leftSection={leftSection}>
                            {item.label}
                        </Menu.Item>
                    );
                })}
            </Menu.Dropdown>
        </Menu>
    );
}
