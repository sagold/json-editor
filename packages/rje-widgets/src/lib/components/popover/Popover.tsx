/**
 * Renders a button that triggers a popover with custom contents.
 * @todo currently the type of button to trigger is hardcoded as button
 *
 * Usage:
 *
 * ```tsx
 *  const { popoverTriggerProps, popoverProps } = usePopover<HTMLButtonElement>();
 *  <button {...popoverTriggerProps}>actions</button>
 *  <Popover {...popoverProps} title="modal title"
 *      modal contents
 *  </Popover>
 * ```
 */
import { DOMAttributes, useRef } from 'react';
import {
    AriaPopoverProps,
    Overlay,
    DismissButton,
    usePopover as useAriaPopover,
    useOverlayTrigger,
    useButton,
    useDialog,
    AriaDialogProps,
    AriaPositionProps
} from 'react-aria';
import { useOverlayTriggerState, OverlayTriggerState } from 'react-stately';
import { FocusableElement, DOMProps } from '@react-types/shared';
import classnames from 'classnames';

export type UsePopoverProps = {
    /** Whether the overlay is open by default (controlled). */
    isOpen?: boolean;
    /** Whether the overlay is open by default (uncontrolled). */
    defaultOpen?: boolean;
    /** Handler that is called when the overlay's open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
    /** placement of popover - can also be passed on popover-components */
    placement?: AriaPositionProps['placement'];
    // # OverlayTriggerProps
    // # AriaButtonProps
};

export function usePopover<T extends HTMLElement = HTMLButtonElement>({ placement, ...props }: UsePopoverProps = {}) {
    const buttonRef = useRef<T>(null);
    const overlayTriggerState = useOverlayTriggerState(props);
    const { triggerProps, overlayProps } = useOverlayTrigger({ type: 'dialog' }, overlayTriggerState, buttonRef);
    const { buttonProps } = useButton(triggerProps, buttonRef);
    return {
        popoverTriggerProps: { ...buttonProps, ref: buttonRef },
        popoverProps: { overlayProps, overlayTriggerRef: buttonRef, overlayTriggerState, placement }
    };
}

export type PopoverProps = {
    title?: string;
    className?: string;
    /** The ref for the element which the popover positions itself with respect to. */
    overlayTriggerRef: React.RefObject<Element>;
    /** overlay trigger state exposing close action */
    overlayTriggerState: OverlayTriggerState;
    children: React.ReactNode;
    overlayProps: DOMProps;
    disabled?: boolean;
    portalContainer?: React.RefObject<Element>;
} & Omit<AriaPopoverProps, 'popoverRef' | 'triggerRef'>;

/**
 * Render popover contents triggered by passed ref-element
 */
export function Popover({ className, children, overlayTriggerRef, overlayProps, disabled, ...props }: PopoverProps) {
    if (!props.overlayTriggerState.isOpen || disabled === true) {
        return null;
    }
    return (
        <PopoverPortal {...props} overlayTriggerRef={overlayTriggerRef} className={className}>
            <PopoverPanel {...overlayProps}>{children}</PopoverPanel>
        </PopoverPortal>
    );
}

type PopoverPortalProps = {
    children: React.ReactNode;
    className?: string;
    /** The ref for the element which the popover positions itself with respect to. */
    overlayTriggerRef: React.RefObject<Element>;
    /** overlay trigger state exposing close action */
    overlayTriggerState: OverlayTriggerState;
    portalContainer?: React.RefObject<Element>;
} & Omit<AriaPopoverProps, 'popoverRef' | 'triggerRef'>;

/**
 * Render popover to body and places its child rje-popover near the trigger element.
 * [react-aria popover portal]
 */
function PopoverPortal({
    children,
    className,
    portalContainer,
    overlayTriggerState,
    overlayTriggerRef,
    offset = 8,
    ...props
}: PopoverPortalProps) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const { popoverProps, underlayProps, arrowProps, placement } = useAriaPopover(
        {
            ...props,
            offset,
            triggerRef: overlayTriggerRef,
            popoverRef
        },
        overlayTriggerState
    );
    return (
        <Overlay portalContainer={portalContainer?.current ?? undefined}>
            <div {...underlayProps} className="rje-underlay rje-underlay--popover" />
            <div
                {...popoverProps}
                ref={popoverRef}
                className={classnames('rje-popover', className)}
                style={{ zIndex: 100 }}
            >
                {/*<svg {...arrowProps} className="rje-popover__arrow" data-placement={placement} width="12" height="6">
                    <path d="M0 0,L6 6,L12 0" />
                </svg>*/}
                <DismissButton onDismiss={overlayTriggerState.close} />
                {children}
                <DismissButton onDismiss={overlayTriggerState.close} />
            </div>
        </Overlay>
    );
}

type PopoverPanelProps = {
    title?: string | React.ReactNode;
    children?: React.ReactNode | React.ReactNode[];
} & AriaDialogProps;

/**
 * Render popover header and contents
 * [react-aria dialog to be used in popover]
 */
function PopoverPanel({ title, children, ...props }: PopoverPanelProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const { dialogProps, titleProps } = useDialog(props, dialogRef);
    return (
        <div {...dialogProps} className="rje-popover__panel" ref={dialogRef}>
            {title && (
                <div {...titleProps} style={{ marginTop: 0 }} className="rje_popover__header">
                    {title}
                </div>
            )}
            <div className="rje_popover__content">{children}</div>
        </div>
    );
}
