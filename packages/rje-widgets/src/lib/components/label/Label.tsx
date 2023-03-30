import { ReactNode, LabelHTMLAttributes } from 'react';
import classnames from 'classnames';

export type LabelProps = {
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    text?: string | ReactNode | ReactNode[];
    children?: ReactNode | ReactNode[];
} & LabelHTMLAttributes<unknown>;

export function Label({ required, disabled, error, children, text, className, ...props }: LabelProps) {
    return (
        <label
            className={classnames('rje-label', className, error ? 'rje-label--invalid' : 'rje-label--valid', {
                'rje-label--required': required,
                'rje-label--disabled': disabled
            })}
            {...props}
        >
            {children ?? text}
            {required && <span className="rje-required-flag">*</span>}
        </label>
    );
}
