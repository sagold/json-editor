import { useRef, ReactNode } from 'react';
import { useToggleState, ToggleProps } from 'react-stately';
import { AriaCheckboxProps, useCheckbox, useFocusRing, VisuallyHidden } from 'react-aria';
import { Icon } from '../icon/Icon';
import { Label } from '../label/Label';
import classnames from 'classnames';

const Whitespace = '\u00A0';

// export function CheckboxUnset() {
//     return <Icon className="rje-checkbox rje-checkbox--unset">remove</Icon>;
// }

// export function CheckboxChecked() {
//     return <Icon className="rje-checkbox rje-checkbox--checked">check</Icon>;
// }

// export function CheckboxUnchecked() {
//     return <Icon className="rje-checkbox rje-checkbox--unchecked">&nbsp;</Icon>;
// }

export type CheckboxProps = {
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    /** Indeterminism is presentational only. The indeterminate visual representation remains regardless of user interaction. */
    // isIndeterminate?: boolean;
    /** The label for the element. */
    children?: ReactNode;
    /** Whether the element should be selected (uncontrolled). */
    defaultSelected?: boolean;
    /** Whether the element should be selected (controlled). */
    isSelected?: boolean;
    /** Handler that is called when the element's selection state changes. */
    onChange?: (isSelected: boolean) => void;
    /** The value of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue). */
    value?: string;
    /** The name of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname). */
    name?: string;
} & AriaCheckboxProps &
    ToggleProps;

export function Checkbox({ disabled, children, required, error, ...props }: CheckboxProps) {
    const stateProps: ToggleProps = { ...props, isDisabled: disabled };
    const state = useToggleState(stateProps);
    const ref = useRef(null);
    const { isFocusVisible, focusProps } = useFocusRing();
    const checkboxProps: AriaCheckboxProps = { ...props, isDisabled: disabled };
    const { inputProps } = useCheckbox(checkboxProps, state, ref);

    return (
        <Label className="rje-checkbox-field" disabled={disabled} required={required} error={error}>
            <VisuallyHidden>
                <input {...inputProps} {...focusProps} ref={ref} />
            </VisuallyHidden>
            <span
                className={classnames('rje-checkbox', `rje-checkbox--${state.isSelected ? 'checked' : 'unchecked'}`, {
                    'rje-checkbox--focused': isFocusVisible
                })}
            >
                <Icon>{state.isSelected ? 'check' : Whitespace}</Icon>
            </span>
            {children}
        </Label>
    );
}
