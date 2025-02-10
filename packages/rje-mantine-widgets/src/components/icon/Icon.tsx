import classNames from 'classnames';
import { CSSProperties } from 'react';

export type IconProps = {
    solid?: boolean;
    children: string;
    onClick?: () => void;
    style?: CSSProperties;
    className?: string;
};

export function Icon({ onClick, className, children, style, solid }: IconProps) {
    return (
        <span
            aria-hidden="true"
            className={classNames('rje-icon', solid && 'rje-icon--solid', onClick && 'rje-icon--clickable', className)}
            style={style}
            onClick={onClick}
        >
            {children}
        </span>
    );
}
