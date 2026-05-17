import './docs-header.scss';
import { ReactElement } from 'react';

export function DocsHeader({
    title,
    breadCrumbs,
    children
}: {
    title: string;
    breadCrumbs?: string;
    children?: ReactElement | ReactElement[];
}) {
    return (
        <div className="mdx-docs-header">
            {breadCrumbs && <div className="mdx-docs-header__breadcrumbs">API Reference</div>}
            {children && <div>{children}</div>}
            <h1 className="mdx-docs-header__title">{title}</h1>
        </div>
    );
}
