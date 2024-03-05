import { createContext, useRef, useContext, ReactNode } from 'react';
import { RadioGroupState, useRadioGroupState } from 'react-stately';
import { AriaRadioGroupProps, AriaRadioProps, VisuallyHidden, useFocusRing, useRadio, useRadioGroup } from 'react-aria';
import { Label } from '../label/Label';
import classNames from 'classnames';

const InternalRadioContext = createContext<RadioGroupState | null>(null);

RadioGroup.Radio = Radio;

export type RadioGroupProps = {
    title?: ReactNode; // label
    disabled?: boolean; // isDisabled
    required?: boolean; // isRequired
    children?: ReactNode;
    error?: boolean;
    /** show radio items in a single row */
    horizontal?: boolean;
    /** Which element should be selected (controlled). */
    value?: string;
    /** Which element should be selected initially (uncontrolled). */
    defaultValue?: string;
    setValue?: (value: number | string) => void;
} & Omit<AriaRadioGroupProps, 'label'>;

export function RadioGroup({ error, title, disabled, required, horizontal, setValue, ...props }: RadioGroupProps) {
    const { children, description, errorMessage } = props;

    const groupProps = {
        ...props,
        label: title,
        isDisabled: disabled,
        isRequired: required,
        onChange: setValue
    };

    const state = useRadioGroupState(groupProps);
    const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } = useRadioGroup(groupProps, state);

    return (
        <div
            className={classNames(
                'rje-radiogroup',
                error ? 'rje-radiogroup--invalid' : 'rje-radiogroup--valid',
                disabled ? 'rje-radiogroup--disabled' : 'rje-radiogroup--enabled',
                horizontal ? 'rje-radiogroup--horizontal' : 'rje-radiogroup--vertical'
            )}
            {...radioGroupProps}
        >
            <Label {...labelProps} required={required} disabled={disabled} error={error} text={title} />
            <InternalRadioContext.Provider value={state}>{children}</InternalRadioContext.Provider>
            {description && (
                <div {...descriptionProps} style={{ fontSize: 12 }}>
                    {description}
                </div>
            )}
            {errorMessage && typeof errorMessage == "object" && (
                <div {...errorMessageProps} style={{ color: 'red', fontSize: 12 }}>
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

export type RadioProps = AriaRadioProps;

export function Radio(props: RadioProps) {
    const { children } = props;
    const state = useContext(InternalRadioContext);
    const { isFocusVisible, focusProps } = useFocusRing();
    const ref = useRef(null);
    // @ts-ignore seems to be valid here: https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/RadioGroup.tsx
    const { inputProps, isSelected, isDisabled } = useRadio(props, state, ref);

    return (
        <label
            className={classNames('rje-radio', {
                'rje-radio--selected': isSelected,
                'rje-radio--disabled': isDisabled,
                'rje-radio--focused': isFocusVisible
            })}
        >
            <VisuallyHidden>
                <input {...inputProps} {...focusProps} ref={ref} />
            </VisuallyHidden>
            <span className="rje-radio__icon"></span>
            <span className="rje-radio__label">{children}</span>
        </label>
    );
}
