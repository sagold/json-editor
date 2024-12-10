import styles from './widget-input-wrapper.module.scss';
import { ActionIcon, Divider, DividerProps, InputWrapper, Popover, Title, TitleOrder, TitleProps } from '@mantine/core';
import { Description } from '../Description';
import { Icon } from '../icon/Icon';
import { DefaultNodeOptions, JsonError } from '@sagold/react-json-editor';
import { ReactNode } from 'react';

export type WidgetInputWrapperProps = {
    errors?: JsonError[];
    order?: TitleOrder;
    options: Pick<DefaultNodeOptions, 'required' | 'title' | 'description'> & {
        collapsed?: boolean;
        descriptionInline?: boolean;
        showTitleDivider?: boolean;
        showHeaderMenu?: boolean;
        dividerProps?: Pick<DividerProps, 'labelPosition' | 'color'>;
        titleProps?: TitleProps;
        showHeader?: boolean;
    };
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    children?: ReactNode | ReactNode[];
};

export function WidgetInputWrapper({
    order,
    leftSection,
    rightSection,
    children,
    errors,
    options
}: WidgetInputWrapperProps) {
    const hasTitle = (options.title && options.title.length > 0) || options.descriptionInline;
    const hasSection = !!leftSection ?? !!rightSection ?? false;
    const hasLabel = (options.showHeader !== false && hasTitle) || hasSection;

    const withInlineDescription = options.description && options.description.length > 0 && !options.descriptionInline;

    return (
        <InputWrapper
            className="rje-widget__header"
            description={withInlineDescription ? <Description text={options.description} /> : undefined}
            label={
                hasLabel && (
                    <>
                        {leftSection}
                        <Divider
                            labelPosition="left"
                            color={options.showTitleDivider ? undefined : 'transparent'}
                            {...(options.dividerProps ?? {})}
                            style={{
                                flexGrow: 1,
                                '--mantine-color-dimmed': 'var(--mantine-color-text)'
                            }}
                            label={
                                <Title order={order} {...(options.titleProps ?? {})}>
                                    {options.title}
                                    {options.required && (
                                        <sup className={styles['asterisk']} aria-hidden>
                                            {' *'}
                                        </sup>
                                    )}
                                    {options.description && options.descriptionInline && (
                                        <Popover position="top" withArrow shadow="md">
                                            <Popover.Target>
                                                <ActionIcon variant="transparent" color="gray">
                                                    <Icon>info</Icon>
                                                </ActionIcon>
                                            </Popover.Target>
                                            <Popover.Dropdown style={{ maxWidth: '80%' }}>
                                                <Description text={options.description} />
                                            </Popover.Dropdown>
                                        </Popover>
                                    )}
                                </Title>
                            }
                        />
                        {rightSection}
                    </>
                )
            }
            error={errors?.map((e) => e.message).join('\n')}
            classNames={{ label: styles['label'] }}
        >
            {children}
        </InputWrapper>
    );
}
