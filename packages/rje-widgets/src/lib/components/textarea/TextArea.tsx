import TextareaAutosize from 'react-textarea-autosize';
import { AriaTextFieldOptions, useTextField } from 'react-aria';
import { useState, useMemo, ChangeEvent } from 'react';
import { Label } from '../../components/label/Label';
import classnames from 'classnames';

export type TextAreaProps = {
    id?: string;
    /** text to be displayed when no selection was made yet */
    placeholder?: string;
    /** label text of selection */
    title?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    readOnly?: boolean;
    /** use value for controlled content, where this value will always be set */
    value?: string;
    /** use defaultValue to set initially selected value */
    defaultValue?: string;
    setValue?: (value: string) => void;
    maxLength?: number;
    minLength?: number;
    liveUpdate?: boolean;
    minRows?: number;
    maxRows?: number;
    rows?: number;
};

export function TextArea({
    id,
    value,
    title,
    defaultValue,
    disabled,
    error,
    placeholder,
    required,
    readOnly,
    maxLength,
    minLength,
    liveUpdate,
    setValue,
    minRows,
    maxRows,
    rows
}: TextAreaProps) {
    const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);
    useMemo(() => {
        if (inputRef) {
            inputRef.value = value ?? '';
        }
    }, [value]);
    const textFieldProps: AriaTextFieldOptions<'textarea'> = {
        defaultValue,
        id,
        isDisabled: disabled,
        isReadOnly: readOnly,
        isRequired: required,
        maxLength: maxLength,
        minLength: minLength,
        label: title,
        placeholder,
        [liveUpdate ? 'onChange' : 'onBlur']: (event: ChangeEvent<HTMLInputElement> | string) => {
            const value: string = typeof event === 'string' ? event : event.target.value;
            setValue && setValue(value);
        }
    };

    const { labelProps, inputProps } = useTextField(textFieldProps, { current: inputRef });

    return (
        <div
            className={classnames(
                'rje-textarea-field',
                error ? 'rje-textarea-field--invalid' : 'rje-textarea-field--valid',
                disabled ? 'rje-textarea-field--disabled' : 'rje-textarea-field--enabled'
            )}
        >
            <Label
                {...labelProps}
                disabled={disabled}
                required={textFieldProps.isRequired}
                error={error}
                text={textFieldProps.label}
            />
            <TextareaAutosize
                className="rje-textarea"
                ref={setInputRef}
                cacheMeasurements
                rows={rows}
                minRows={minRows}
                maxRows={maxRows}
                {...{ ...inputProps, style: undefined }}
            />
        </div>
    );
}
