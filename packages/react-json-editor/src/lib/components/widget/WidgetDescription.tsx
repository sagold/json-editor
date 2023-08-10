import { ReactNode } from 'react';
import Markdown from 'markdown-to-jsx';

export type WidgetDescriptionProps = {
    enabled?: boolean;
    className?: string;
    children?: ReactNode | ReactNode[];
};

export function WidgetDescription({ children, className, enabled }: WidgetDescriptionProps) {
    if (enabled === false || children == null || children === '') {
        return null;
    }
    return (
        <div className={`rje-description ${className ?? ''}`.trim()}>
            <Markdown>{`${children}`}</Markdown>
        </div>
    );
}
