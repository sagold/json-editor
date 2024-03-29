import { useState, useMemo, ChangeEvent } from 'react';
import { useTextField, AriaTextFieldOptions } from 'react-aria';
import { InputDecorator, InputDecoratorProps } from './InputDecorator';
import { Label } from '../label/Label';
import classnames from 'classnames';

export type StringInputProps = {
    id?: string;
    title?: string;
    type?: 'text' | 'password'; // type?: 'text' | 'search' | 'url' | 'tel' | 'email' | 'password' | (string & {}),
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    emitOnChange?: boolean;
    onPress?: (value: string) => void;
    iconPosition?: 'left' | 'right';
} & Omit<InputDecoratorProps, 'swapIconPosition'> &
    AriaTextFieldOptions<'input'>;

export function StringInput({ icon, tag, iconPosition, title, error, onPress, value, ...props }: StringInputProps) {
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    useMemo(() => {
        if (inputRef) {
            inputRef.value = value ?? '';
        }
    }, [value, inputRef]);

    const textFieldProps: AriaTextFieldOptions<'input'> = {
        ...props,
        inputElementType: 'input',
        isDisabled: props.disabled,
        isReadOnly: props.readOnly === true,
        isRequired: props.required === true,
        label: title,
        /* @todo check react-aria for correct initialization */
        defaultValue: value ?? props.defaultValue,
        placeholder: props.placeholder,
        [props.emitOnChange ? 'onChange' : 'onBlur']: (event: ChangeEvent<HTMLInputElement> | string) => {
            onPress && onPress(typeof event === 'string' ? event : event.target.value);
        }
    };
    const { labelProps, inputProps } = useTextField(textFieldProps, {
        current: inputRef
    });
    return (
        <div
            className={classnames(
                'rje-input',
                'rje-input--string',
                error ? 'rje-input--invalid' : 'rje-input--valid',
                props.disabled ? 'rje-input--disabled' : 'rje-input--enabled',
                {
                    'rje-input--readonly': props.readOnly
                }
            )}
        >
            <Label
                {...labelProps}
                required={textFieldProps.isRequired}
                disabled={props.disabled}
                error={error}
                text={title}
            />
            <InputDecorator
                icon={icon}
                tag={tag}
                swapIconPosition={iconPosition === 'right'}
                error={error}
                disabled={textFieldProps.isDisabled}
            >
                <input {...inputProps} ref={setInputRef} value={inputRef?.value ?? value ?? ""} />
            </InputDecorator>
        </div>
    );
}
