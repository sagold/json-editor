import { useRef } from 'react';
import { useLabel, useButton, LabelAriaProps, AriaButtonProps } from 'react-aria';
import { Label } from '../label/Label';
import { ButtonControlled } from '../button/Button';

export type FileFieldProps = {
    id?: string;
    label?: React.ReactNode;
    buttonText?: string;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    onPress?: (file: File) => void;
    /**
     * mime types to accept for this file selection
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    accept?: string;
} & LabelAriaProps;

export function FileField({ onPress, error, ...props }: FileFieldProps) {
    const { labelProps, buttonProps, fieldProps } = useFileField({
        ...props,
        isDisabled: props.disabled
    });
    return (
        <div className={`rje-file ${error ? 'rje-file--error' : 'rje-file--valid'}`}>
            <Label {...labelProps} required={props.required}>
                {props.label}
            </Label>
            <div style={{ position: 'relative' }}>
                <ButtonControlled icon="folder_open" {...buttonProps}>
                    {props.buttonText}
                </ButtonControlled>
                <input
                    type="file"
                    style={{
                        position: 'absolute',
                        opacity: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        cursor: 'pointer'
                    }}
                    accept={props.accept}
                    id={props.id}
                    disabled={props.disabled}
                    onChange={(event) => {
                        const files = event.target.files;
                        if (files != null) {
                            onPress?.(files[0]);
                        }
                    }}
                    {...fieldProps}
                />
            </div>
        </div>
    );
}

export function useFileField(props: LabelAriaProps & AriaButtonProps<'button'>) {
    const { labelProps, fieldProps } = useLabel(props); // AriaFieldProps
    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileButtonRef = useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton(
        {
            onPress: () => fileInputRef.current?.click()
        },
        fileButtonRef
    );

    return {
        labelProps,
        buttonProps: { ...buttonProps, ref: fileButtonRef },
        isPressed,
        fieldProps: { ...fieldProps, ref: fileInputRef }
    };
}
