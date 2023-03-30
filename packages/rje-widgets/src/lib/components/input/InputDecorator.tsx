import { ReactElement, useState } from 'react';

export type InputDecoratorProps = {
    icon?: string;
    tag?: string;
    disabled?: boolean;
    error?: boolean;
    swapIconPosition?: boolean;
};

/**
 * add optional icon and/or tag to an single line input field
 */
export function InputDecorator(props) {
    const classNames = ['rje-input-decorator'];
    const [tagWidth, setTagWidth] = useState<number>(0);
    const { swapIconPosition = false } = props;

    if (props.disabled) {
        classNames.push('rje-input-decorator--disabled');
    }

    if (props.error) {
        classNames.push('rje-input-decorator--error');
    }

    let icon: ReactElement | null = null;
    if (props.icon) {
        icon = <div className="rje-input-decorator__decor rje-icon">{props.icon}</div>;
        classNames.push('with-icon', swapIconPosition ? 'with-icon--right' : 'with-icon--left');
    }

    let tag: ReactElement | null = null;
    if (props.tag) {
        tag = (
            <div ref={(div) => div && setTagWidth(div.clientWidth)} className="rje-input-decorator__decor rje-tag">
                {props.tag}
            </div>
        );
        classNames.push('with-tag', swapIconPosition ? 'with-tag--left' : 'with-tag--right');
    }

    return (
        <div className={classNames.join(' ')} style={{ '--rje-tag-width': tagWidth } as React.CSSProperties}>
            {swapIconPosition ? tag : icon}
            {props.children}
            {swapIconPosition ? icon : tag}
        </div>
    );
}
