import './docs-header.scss';
import { ReactElement } from 'react';

export function DocsHeader({
    title,
    type,
    breadCrumbs,
    children
}: {
    title: string;
    type?: string;
    breadCrumbs?: string;
    children?: ReactElement | ReactElement[];
}) {
    return (
        <div className="mdx-docs-header">
            {breadCrumbs && <div className="mdx-docs-header__breadcrumbs">API Reference</div>}
            {children && <div>{children}</div>}
            <h1 className="mdx-docs-header__title">
                {title} {type && <span style={{ fontSize: '0.7em', fontWeight: 400 }}> : {type}</span>}
            </h1>
        </div>
    );
}
