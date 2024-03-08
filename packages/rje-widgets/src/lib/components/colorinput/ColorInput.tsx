import { CSSProperties, useRef, useMemo } from 'react';
import { JsonError, Label , WidgetError } from '@sagold/react-json-editor';
import { useColorField, type AriaColorFieldProps } from '@react-aria/color';
import { useColorFieldState, type ColorFieldProps, parseColor, type Color } from '@react-stately/color';

export type ColorInputProps = {
    title?: string;
    error?: boolean;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    defaultValue?: string;
    value?: string;
} & Omit<AriaColorFieldProps, 'defaultValue' | 'value' | 'onChange'> &
    Omit<ColorFieldProps, 'defaultValue' | 'value' | 'onChange'>;

export function useColorValue(defaultValue?: string, value?: string): [Color?, Color?, JsonError?] {
    return useMemo(
        (...args) => {
            try {
                return [defaultValue ? parseColor(defaultValue) : undefined, value ? parseColor(value) : undefined];
            } catch (error) {
                return [
                    undefined,
                    undefined,
                    {
                        type: 'error',
                        code: `unsupported-color-format`,
                        name: 'UnsuportedColorFormat',
                        message: `'${defaultValue || value}' is not a supported hex color-format.`,
                        data: { defaultValue, value, pointer: '', schema: {} }
                    }
                ];
            }
        },
        [defaultValue, value]
    );
}

export function ColorInput({
    title,
    required,
    disabled,
    error,
    defaultValue,
    value,
    onChange,
    ...props
}: ColorInputProps) {
    const [defaultColor, color, parseError] = useColorValue(defaultValue, value);
    const state = useColorFieldState({
        ...props,
        defaultValue: defaultColor,
        value: color,
        onChange(color) {
            if (onChange) {
                onChange(color?.toString('hex') ?? '');
            }
        }
    });
    const inputRef = useRef(null);
    const { labelProps, inputProps } = useColorField(
        {
            ...props,
            defaultValue: defaultColor,
            value: color
        },
        state,
        inputRef
    );
    const style = { '--rje-color-value': state.inputValue } as CSSProperties;

    return (
        <div className="rje-input rje-input--color" style={style}>
            {title && (
                <Label
                    {...labelProps}
                    required={required}
                    disabled={disabled}
                    error={error || parseError != null}
                    text={title}
                />
            )}
            <div className="rje-input__wrapper">
                <span className="rje-input__color" />
                <input className="rje-input__element" {...inputProps} ref={inputRef} />
            </div>
            {parseError && <WidgetError errors={[parseError]} />}
        </div>
    );
}
