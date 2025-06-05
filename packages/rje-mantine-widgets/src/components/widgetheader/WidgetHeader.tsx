import { ActionIcon, Divider, DividerProps, Popover, Title, TitleOrder, TitleProps } from '@mantine/core';
import { Icon } from '../icon/Icon';
import { isStringWithContent } from '../../helper/isStringWithContent';
import { ReactNode } from 'react';
import { WidgetDescription } from '../WidgetDescription';
import { WidgetMenu, WidgetMenuItems } from '../widgetmenu/WidgetMenu';
import { DefaultNodeOptions } from '@sagold/react-json-editor';

export type WidgetParentHeaderProps = {
    isArrayItem?: boolean;
    title?: string | ReactNode;
    order?: TitleOrder;
    titleProps?: TitleProps;
    description?: string;
    dividerProps?: DividerProps;
    required?: boolean;
    disabled?: boolean;
    showHeaderMenu?: boolean;
    readOnly?: boolean;
    leftSection?: ReactNode;
    showDivider?: boolean;
    widgetMenuAriaLabel?: string;
    widgetMenuItems?: WidgetMenuItems;
};

function isWidgetParentHeaderEmpty(options: DefaultNodeOptions, widgetMenuItems: WidgetMenuItems = []) {
    const withTitle = isStringWithContent(options.title);
    const withDescription = isStringWithContent(options.description);
    if (options.showHeader === false) {
        return true;
    }
    if (
        !withTitle &&
        !withDescription &&
        options.collapsed == null &&
        (widgetMenuItems.length === 0 || options.showHeaderMenu === false)
    ) {
        return true;
    }
    return false;
}

WidgetParentHeader.isEmpty = isWidgetParentHeaderEmpty;

export function WidgetParentHeader({
    title,
    order,
    description,
    required,
    disabled,
    readOnly,
    isArrayItem,
    leftSection,
    showHeaderMenu,
    widgetMenuAriaLabel,
    widgetMenuItems = [],
    titleProps = {},
    showDivider,
    dividerProps = {}
}: WidgetParentHeaderProps) {
    const withDescription = isStringWithContent(description);

    let rightSection;
    if (readOnly !== true && widgetMenuItems.length > 0 && showHeaderMenu !== false) {
        rightSection = (
            <WidgetMenu
                inline={false}
                offset={0}
                ariaLabel={widgetMenuAriaLabel}
                position={'left-start'}
                transitionProps={{ transition: 'slide-left', duration: 100 }}
                icon={isArrayItem ? 'more_horiz' : 'menu'}
                disabled={disabled}
                items={widgetMenuItems}
            />
        );
    }

    return (
        <div className="rje-widget__parent-header" style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {leftSection}
            <Divider
                labelPosition="left"
                color={showDivider ? undefined : 'transparent'}
                {...dividerProps}
                style={{
                    flexGrow: 1,
                    '--mantine-color-dimmed': 'var(--mantine-color-text)'
                }}
                label={
                    <Title order={order} {...titleProps}>
                        {title}
                        {required && (
                            <span className={'rje-widget__asterisk'} aria-hidden>
                                *
                            </span>
                        )}
                        {withDescription && (
                            <Popover position="top" withArrow shadow="md">
                                <Popover.Target>
                                    <ActionIcon variant="transparent" color="gray">
                                        <Icon>info</Icon>
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown style={{ maxWidth: '80%' }}>
                                    <WidgetDescription text={description} />
                                </Popover.Dropdown>
                            </Popover>
                        )}
                    </Title>
                }
            />
            {rightSection}
        </div>
    );
}
