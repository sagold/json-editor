import { useButton, AriaButtonProps } from 'react-aria';
import { useRef, forwardRef, ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';
import { Icon } from '../icon/Icon';
import classNames from 'classnames';

export type ButtonProps = {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
    style?: CSSProperties;
    variant?: 'primary' | 'secondary' | 'text';
} & AriaButtonProps;

export function Button({ children, className, disabled, icon, iconPosition, style, variant, ...props }: ButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton(
        {
            ...props,
            isDisabled: disabled,
            // https://github.com/adobe/react-spectrum/issues/4355
            // https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/button/src/useButton.ts#L58
            // @ts-expect-error - undocumented
            preventFocusOnPress: true
        },
        ref
    );
    return (
        <ButtonControlled
            {...buttonProps}
            isPressed={isPressed}
            variant={variant}
            icon={icon}
            style={style}
            className={className}
            iconPosition={iconPosition}
            disabled={disabled}
        >
            {children}
        </ButtonControlled>
    );
}

export type ButtonControlledProps = {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    icon?: string;
    iconPosition?: 'left' | 'right';
    isPressed?: boolean;
    style?: CSSProperties;
    variant?: 'primary' | 'secondary' | 'text';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonControlled = forwardRef<HTMLButtonElement, ButtonControlledProps>(function _ButtonControlled(
    { children, className, icon, iconPosition, isPressed, style, variant = 'secondary', ...buttonProps },
    ref
) {
    const iconLeft = icon && iconPosition !== 'right';
    const iconRight = icon && iconPosition === 'right';
    return (
        <button
            {...buttonProps}
            className={classNames('rje-button', `rje-button--${variant}`, className, {
                'with-icon--right': iconRight,
                'with-icon--left': iconLeft,
                'rje-button--pressed': isPressed
            })}
            ref={ref}
            style={style}
        >
            {iconLeft && <Icon>{icon}</Icon>}
            {children}
            {iconRight && <Icon>{icon}</Icon>}
        </button>
    );
});

Button.Controlled = ButtonControlled;
