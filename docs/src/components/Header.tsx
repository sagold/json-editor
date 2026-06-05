import { ReactNode } from 'react';
import logo from '../../images/he-square-700x540-orange.png';
import './header.scss';

function Badge({ link, image }: { link: string; image: string }) {
    return (
        <a className="rje-docs-badge" href={link}>
            <img src={image} />
        </a>
    );
}

Header.Title = function HeaderTitle({ label, children }: { label?: string; children?: ReactNode }) {
    const classes = ['rje-docs-header-title'];
    if (label && !children) {
        classes.push('rje-docs-header-title--label-only');
    } else if (!label && children) {
        classes.push('rje-docs-header-title--title-only');
    }
    return (
        <div className={classes.join(' ')}>
            {label && <div className="rje-docs-header-title__label">{label}</div>}
            {children && <div className="rje-docs-header-title__title">{children}</div>}
        </div>
    );
};

type HeaderProps = {
    green?: ReactNode;
    yellow?: ReactNode;
    orange?: ReactNode;
    red?: ReactNode;
};

export function Header({ green, yellow, orange, red }: HeaderProps) {
    return (
        <div className="rje-docs-header rje-docs--fullwidth">
            <img src={logo} />
            <div className="rje-docs-header__badges">
                <Badge
                    link="https://GitHub.com/sagold/json-editor/"
                    image="https://badgen.net/badge/icon/github?icon=github&label"
                />
                <Badge
                    link="https://GitHub.com/sagold/json-editor/"
                    image="https://badgen.net/npm/v/@sagold/react-json-editor"
                />
            </div>

            <div className="rje-docs-header__content" style={{ textAlign: 'center' }}>
                <div className="rje-docs-header-content rje-docs-header-content--green">{green}</div>
                <div className="rje-docs-header-content rje-docs-header-content--yellow">{yellow}</div>
                <div className="rje-docs-header-content rje-docs-header-content--orange">{orange}</div>
                <div className="rje-docs-header-content rje-docs-header-content--red">{red}</div>
            </div>
        </div>
    );
}
