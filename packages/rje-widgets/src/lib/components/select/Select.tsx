import classNames from 'classnames';
import { useRef } from 'react';
import { Item, useSelectState, SelectProps as UseSelectProps } from 'react-stately';
import { HiddenSelect, useSelect, DismissButton, Overlay, usePopover, useButton } from 'react-aria';
import { Label } from '../label/Label';
import { SelectOptionsControlled } from '../selectoptions/SelectOptions';

function SelectButton(props) {
    /** this is a duplicate to our default button */
    let ref = props.buttonRef;
    let { buttonProps, isPressed } = useButton(props, ref);
    return (
        <button
            {...buttonProps}
            ref={ref}
            className={classNames('rje-select__button', { 'rje-select__button--pressed': isPressed })}
        >
            {props.children}
        </button>
    );
}

function Popover({ children, state, triggerRef, placement, portalContainer }) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const { popoverProps } = usePopover(
        {
            containerPadding: 0, // containerPadding has a default of 12...
            triggerRef,
            popoverRef
        },
        state
    );
    return (
        <Overlay portalContainer={portalContainer.current}>
            <div {...popoverProps} className="rje-overlay rje-overlay--select" ref={popoverRef}>
                <DismissButton onDismiss={state.close} />
                {children}
                <DismissButton onDismiss={state.close} />
            </div>
        </Overlay>
    );
}

export type SelectProps = {
    id?: string;
    /** text to be displayed when no selection was made yet */
    placeholder?: string;
    /** label text of selection */
    title?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    /** use selectedKey for controlled selection, where this value will always be set */
    selectedKey?: number | string;
    /** use defaultSelectedKey to set initially selected value */
    defaultSelectedKey?: number | string;
    setValue?: (value: number | string) => void;
    children: UseSelectProps<object>['children'];
};

Select.Option = Item;

export function Select({
    id,
    title,
    children,
    placeholder,
    required,
    error,
    disabled,
    selectedKey,
    defaultSelectedKey,
    setValue
}: SelectProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const selectButtonRef = useRef<HTMLButtonElement>(null);
    const selectProps: UseSelectProps<object> = {
        children,
        selectedKey,
        defaultSelectedKey: defaultSelectedKey,
        onSelectionChange: setValue,
        isRequired: required,
        isDisabled: disabled
    };
    const state = useSelectState(selectProps);
    const { labelProps, triggerProps, valueProps, menuProps } = useSelect(selectProps, state, selectButtonRef);
    return (
        <div
            className={classNames('rje-select-field', error ? 'rje-select-field--invalid' : 'rje-select-field--valid')}
            ref={parentRef}
        >
            {title && (
                <Label {...labelProps} disabled={disabled} required={required}>
                    {title}
                </Label>
            )}
            <div className="rje-select">
                <HiddenSelect state={state} triggerRef={selectButtonRef} label={placeholder} name={id} />
                <SelectButton {...triggerProps} buttonRef={selectButtonRef}>
                    <span
                        {...valueProps}
                        className={classNames('rje-selected__value', {
                            'rje-selected__value--placeholder': !state.selectedItem
                        })}
                    >
                        {state.selectedItem ? state.selectedItem.rendered : placeholder}
                    </span>
                    <span aria-hidden="true" className="rje-icon">
                        arrow_drop_down
                    </span>
                </SelectButton>
                {state.isOpen && (
                    <Popover
                        state={state}
                        triggerRef={selectButtonRef}
                        placement="bottom start"
                        portalContainer={parentRef}
                    >
                        <SelectOptionsControlled {...menuProps} state={state}>
                            {children}
                        </SelectOptionsControlled>
                    </Popover>
                )}
            </div>
        </div>
    );
}
