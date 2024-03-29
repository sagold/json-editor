import { useRef } from 'react';
import { Label } from '../label/Label';
import { ButtonControlled } from '../button/Button';
import { Popover, usePopover } from '../../components/popover/Popover';
import classNames from 'classnames';
import { WidgetDescription } from '../widgetdescription/WidgetDescription';

SectionHeader.Label = SectionHeaderLabel;

export type SectionHeaderLabelProps = {
    children?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    separator?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    /** header size relative to 1 (em) */
    size?: number;
};

export function SectionHeaderLabel({
    children,
    title,
    description,
    separator,
    disabled,
    size = 1,
    ...labelProps
}: SectionHeaderLabelProps) {
    const portalContainer = useRef<HTMLDivElement>(null);
    const { popoverProps, popoverTriggerProps } = usePopover({
        placement: 'bottom end'
    });

    return (
        <div
            ref={portalContainer}
            style={{ position: 'relative', fontSize: `${size}em` }}
            className={classNames('rje-section-header__label', {
                'rje-section-header__label--disabled': disabled,
                'with-separator': separator,
                'with-description': description != null && description != ''
            })}
        >
            <Label {...labelProps} disabled={disabled}>
                {children ?? title}
            </Label>
            {description && (
                <>
                    <ButtonControlled
                        {...popoverTriggerProps}
                        disabled={disabled}
                        className="rje-section-header__info"
                        icon="info"
                        variant="text"
                    />
                    <Popover
                        {...popoverProps}
                        className="rje-section-header__description"
                        portalContainer={portalContainer}
                    >
                        <WidgetDescription className="rje-description--tooltip">{description}</WidgetDescription>
                    </Popover>
                </>
            )}
            {separator && <div className="rje-section-header__separator"></div>}
        </div>
    );
}

export function SectionHeader({ children }) {
    return <div className="rje-section-header">{children}</div>;
}
