import { ReactNode } from 'react';
import classnames from 'classnames';

export type WidgetDescription = {
    enabled?: boolean;
    className?: string;
    children?: ReactNode | ReactNode[];
};

export function WidgetDescription({ children, className, enabled }: WidgetDescription) {
    if (enabled === false || children == null || children === '') {
        return null;
    }
    return <div className={classnames('rje-description', className)}>{children}</div>;
}
