/**
 * Renders a button that triggers a popover with custom contents.
 * @todo currently the type of button to trigger is hardcoded as button
 *
 * Usage:
 *
 * ```tsx
 *  const { modalTriggerProps, modalProps } = usePopover<HTMLButtonElement>();
 *  <button {...modalTriggerProps}>actions</button>
 *  <Modal.Overlay>
 *    <Modal {...modalProps}"
 *      modal contents
 *    </Modal>
 *  </Modal.Overlay>
 * ```
 */
import { useRef, cloneElement } from 'react';
import { Overlay, useModalOverlay , useOverlayTrigger, useButton } from 'react-aria';

import { useOverlayTriggerState, OverlayTriggerState } from 'react-stately';
import { DOMProps } from '@react-types/shared';

export type UseModalProps = {
    // # OverlayTriggerProps
    /** Whether the overlay is open by default (controlled). */
    isOpen?: boolean;
    /** Whether the overlay is open by default (uncontrolled). */
    defaultOpen?: boolean;
    /** Handler that is called when the overlay's open state changes. */
    onOpenChange?: (isOpen: boolean) => void;
    // # OverlayTriggerProps
    // # AriaButtonProps
};

export function useModal<T extends HTMLElement = HTMLButtonElement>(props: UseModalProps = {}) {
    const buttonRef = useRef<T>(null);
    const overlayTriggerState = useOverlayTriggerState(props);
    const { triggerProps, overlayProps } = useOverlayTrigger({ type: 'dialog' }, overlayTriggerState);
    const { buttonProps } = useButton(triggerProps, buttonRef);
    return {
        modalTriggerProps: { ...buttonProps, ref: buttonRef },
        modalProps: { ...props, overlayProps, overlayTriggerRef: buttonRef, overlayTriggerState }
    };
}

export type ModalProps = {
    overlayTriggerState: OverlayTriggerState;
    overlayProps: DOMProps;
    portalContainer?: React.RefObject<Element>;
    children: (close: () => void) => React.ReactElement;
    // # AriaModalOverlayProps
    /**
     * Whether to close the modal when the user interacts outside it.
     * @default false
     */
    isDismissable?: boolean;
    /**
     * Whether pressing the escape key to close the modal should be disabled.
     * @default false
     */
    isKeyboardDismissDisabled?: boolean;
};

Modal.Overlay = Overlay;

export function Modal({ overlayTriggerState, overlayProps, children, portalContainer, ...props }: ModalProps) {
    const ref = useRef(null);
    const { modalProps, underlayProps } = useModalOverlay(props, overlayTriggerState, ref);
    if (!overlayTriggerState.isOpen) {
        return null;
    }

    return (
        <Overlay portalContainer={portalContainer?.current ?? undefined}>
            <div {...underlayProps} className="rje-underlay rje-underlay--modal">
                <div {...modalProps} className="rje-modal" ref={ref}>
                    <div className="rje-modal__content" {...overlayProps}>
                        {cloneElement(children(overlayTriggerState.close), overlayProps)}
                    </div>
                </div>
            </div>
        </Overlay>
    );
}
