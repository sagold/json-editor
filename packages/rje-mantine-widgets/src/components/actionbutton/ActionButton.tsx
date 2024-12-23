import { ActionIcon } from '@mantine/core';
import { Icon } from '../icon/Icon';
import { CSSProperties, MouseEventHandler, forwardRef } from 'react';

export type ActionButtonProps = {
    icon: string;
    label?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    style?: CSSProperties;
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
    { icon, disabled, onClick, label, style },
    ref
) {
    return (
        <ActionIcon
            ref={ref}
            aria-label={label}
            onClick={onClick}
            variant="subtle"
            disabled={disabled}
            color={'var(--rje-action-color)'}
            style={style}
        >
            <Icon>{icon}</Icon>
        </ActionIcon>
    );
});
