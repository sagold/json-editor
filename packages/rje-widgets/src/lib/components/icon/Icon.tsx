import classnames from 'classnames';
import { MouseEventHandler } from 'react';

export type IconProps = {
    solid?: boolean;
    className?: string;
    children: string;
    onClick?: MouseEventHandler<HTMLSpanElement>;
};

export function Icon({ solid, className, onClick, children }: IconProps) {
    return (
        <span
            onClick={onClick}
            className={classnames('rje-icon', solid ? 'rje-icon--solid' : 'rje-icon--outline', className)}
        >
            {children}
        </span>
    );
}
