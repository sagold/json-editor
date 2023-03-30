import { useRef, useMemo } from 'react';
import { useNumberField, useLocale } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { InputDecorator, InputDecoratorProps } from './InputDecorator';
import { Label } from '../label/Label';
import classnames from 'classnames';
import { Button } from '../button/Button';

export type NumberInputProps = {
    defaultValue?: number;
    disabled?: boolean;
    format?: Intl.NumberFormatOptions;
    icon?: string;
    iconPosition?: 'left' | 'right';
    id?: string;
    onPress?: (value: number) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    tag?: string;
    title?: string;
    value?: number;
    maximum?: number;
    minimum?: number;
    /* add increment/decrement buttons */
    withButtons?: boolean;
} & Omit<InputDecoratorProps, 'swapIconPosition'>;

export function NumberInput({
    icon,
    tag,
    iconPosition,
    title,
    error,
    onPress,
    value,
    defaultValue,
    ...props
}: NumberInputProps) {
    const numberInputRef = useRef<HTMLInputElement>(null);
    const format: Intl.NumberFormatOptions = useMemo(
        () =>
            props.format ?? {
                useGrouping: false
            },
        [props.format]
    );
    const { locale } = useLocale();
    const state = useNumberFieldState({
        defaultValue,
        formatOptions: format,
        locale,
        maxValue: props.maximum,
        minValue: props.minimum,
        onChange: onPress,
        value
    });
    const { labelProps, inputProps, decrementButtonProps, incrementButtonProps } = useNumberField(
        {
            defaultValue: value,
            id: props.id,
            isDisabled: props.disabled,
            isReadOnly: props.readOnly === true,
            isRequired: props.required === true,
            label: title,
            placeholder: props.placeholder
        },
        state,
        numberInputRef
    );
    return (
        <div
            className={classnames(
                'rje-input',
                'rje-input--number',
                error ? 'rje-input--invalid' : 'rje-input--valid',
                props.disabled ? 'rje-input--disabled' : 'rje-input--enabled'
            )}
        >
            <Label {...labelProps} required={props.required} disabled={props.disabled} error={error} text={title} />
            <InputDecorator
                icon={icon}
                tag={tag}
                swapIconPosition={iconPosition === 'right'}
                error={error}
                disabled={props.disabled}
            >
                <div className="rje-number">
                    <input {...inputProps} ref={numberInputRef} />
                    {props.withButtons && (
                        <div className="rje-number__actions">
                            <Button className="rje-number__inc" {...incrementButtonProps}>
                                <span className="rje-icon">keyboard_arrow_up</span>
                            </Button>
                            <Button className="rje-number__dec" {...decrementButtonProps}>
                                <span className="rje-icon">keyboard_arrow_down</span>
                            </Button>
                        </div>
                    )}
                </div>
            </InputDecorator>
        </div>
    );
}
