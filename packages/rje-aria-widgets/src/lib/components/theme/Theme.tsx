import { CSSProperties, ReactNode } from 'react';
import classnames from 'classnames';
import themeVariables from '../../theme';

export type ThemeProps = {
    theme?: string;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

export function Theme({ theme = 'light', className, style, children }: ThemeProps) {
    const applyStyle = { ...themeVariables };
    if (style) {
        Object.assign(applyStyle, style);
    }

    return (
        <div
            style={applyStyle}
            className={classnames('rje-form', 'rje-theme', className, {
                [`rje-theme--${theme}`]: typeof theme === 'string'
            })}
        >
            {children}
        </div>
    );
}
