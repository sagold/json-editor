import { useRef, ReactNode } from 'react';
import { useTooltipTriggerState, TooltipTriggerState } from 'react-stately';
import {
    mergeProps,
    useTooltip as useAriaTooltip,
    useTooltipTrigger,
    TooltipTriggerProps,
    AriaTooltipProps
} from 'react-aria';
import { FocusableElement } from '@react-types/shared';

export type UseTooltipProps = TooltipTriggerProps & {
    /** Whether the tooltip should be disabled, independent from the trigger. */
    isDisabled?: boolean;
    /** The delay time for the tooltip to show up.
     * [See guidelines](https://spectrum.adobe.com/page/tooltip/#Immediate-or-delayed-appearance).
     * @default 1500 */
    delay?: number;
    /** By default, opens for both focus and hover. Can be made to open only for focus. */
    trigger?: 'focus';
};

export function useTooltip<T extends FocusableElement = HTMLButtonElement>(props: UseTooltipProps) {
    const state = useTooltipTriggerState(props);
    const buttonRef = useRef<T>(null);
    const { triggerProps, tooltipProps } = useTooltipTrigger(props, state, buttonRef);
    return {
        tooltipTriggerProps: { ...triggerProps, ref: buttonRef },
        tooltipProps: { ...tooltipProps, state }
    };
}

export type TooltipProps = {
    className?: string;
    state: TooltipTriggerState;
    children: ReactNode;
} & AriaTooltipProps;

export function Tooltip({ state, ...props }: TooltipProps) {
    const { tooltipProps } = useAriaTooltip(props, state);
    if (!state.isOpen) {
        return null;
    }
    return <div {...mergeProps(props, tooltipProps, { className: 'rje-tooltip' })}>{props.children}</div>;
}
