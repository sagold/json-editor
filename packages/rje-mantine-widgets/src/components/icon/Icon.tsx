import classNames from 'classnames';
import styles from './icon.module.scss';
import { CSSProperties } from 'react';

const MAP: Record<string, string> = {
    pending: 'hourglass_empty',
    accepted: 'check_circle',
    declined: 'cancel'
};

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
            className={classNames(
                'icon',
                styles['icon'],
                solid && styles['icon--solid'],
                onClick && styles['icon--clickable'],
                className
            )}
            style={style}
            onClick={onClick}
        >
            {MAP[children] ?? children}
        </span>
    );
}
