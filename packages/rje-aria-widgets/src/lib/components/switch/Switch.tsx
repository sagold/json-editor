import { useRef } from 'react';
import { useToggleState, ToggleProps } from 'react-stately';
import { AriaCheckboxProps, useCheckbox } from 'react-aria';
import { Label } from '../label/Label';
import classnames from 'classnames';

import { CheckboxProps } from '../checkbox/Checkbox';

export type SwitchProps = CheckboxProps & {
    /** if state change should be animated. Defaults to false */
    animate?: boolean;
};

export function Switch({ disabled, animate, children, required, error, ...props }: SwitchProps) {
    const stateProps: ToggleProps = { ...props, isDisabled: disabled };
    const state = useToggleState(stateProps);
    const ref = useRef<HTMLInputElement>(null);
    const checkboxProps: AriaCheckboxProps = { ...props, isDisabled: disabled };
    const { inputProps } = useCheckbox(checkboxProps, state, ref);

    return (
        <Label className="rje-switch-field" disabled={disabled} required={required} error={error}>
            <input
                className={classnames('rje-switch-input', { 'with-animation': animate })}
                {...inputProps}
                ref={ref}
            />
            {children}
        </Label>
    );
}
