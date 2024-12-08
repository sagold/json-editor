import { CSSProperties, useRef, useState, type ChangeEventHandler } from 'react';
import { useLabel, useButton, LabelAriaProps, AriaButtonProps } from 'react-aria';
import { Label } from '../label/Label';
import { Button, ButtonControlled } from '../button/Button';
import { Icon } from '../icon/Icon';
import classnames from 'classnames';
import { PressEvent } from '@react-types/shared';

const nativeInputStyle: CSSProperties = {
    position: 'absolute',
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none'
};

export type FileFieldProps = {
    id?: string;
    title?: React.ReactNode;
    buttonText?: string;
    disabled?: boolean;
    readOnly?: boolean;
    children?: React.ReactNode;
    /* Default: folder_open */
    icon?: string;
    required?: boolean;
    error?: boolean;
    /* filename if already stored, will not be emitted on change */
    value?: string;
    onPress?: (file?: File) => void;
    /**
     * mime types to accept for this file selection
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    accept?: string;
} & LabelAriaProps;

// @todo value for controlled values (jed)
// @todo defaultValue for uncontrolled values (component)
export function FileField({ onPress, error, title, icon = 'folder_open', value, children, ...props }: FileFieldProps) {
    const [filename, setFilename] = useState<string | undefined>(value);
    const { labelProps, buttonProps, fieldProps } = useFileField({
        ...props,
        label: title,
        isDisabled: props.disabled
    });

    let onChange: ChangeEventHandler<HTMLInputElement> | undefined;
    let onReset: ((event: PressEvent) => void) | undefined;
    if (!props.disabled && !props.readOnly) {
        onReset = (e) => {
            if (fieldProps.ref.current) {
                fieldProps.ref.current.value = '';
                setFilename(undefined);
                onPress?.(undefined);
            }
        };
        onChange = (event) => {
            const files = event.target.files;
            if (files != null) {
                setFilename(files[0].name);
                onPress?.(files[0]);
            }
        };
    }

    // const selectedFilePath = fieldProps.ref.current?.value
    //     ? `${fieldProps.ref.current?.value}`.replace('C:\\fakepath\\', '')
    //     : null;
    // console.log('filepath', selectedFilePath);

    return (
        <div
            className={classnames(
                'rje-input',
                'rje-input--file',
                error ? 'rje-input--invalid' : 'rje-input--valid',
                props.disabled ? 'rje-input--disabled' : 'rje-input--enabled'
            )}
        >
            <Label {...labelProps} required={props.required}>
                {title}
            </Label>
            <div
                className="rje-file__wrapper"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    // justifyContent: 'space-between',
                    alignItems: 'start'
                }}
            >
                {children}
                <div
                    title={filename}
                    className={classnames('rje-file', { 'with-clear-action': filename != null })}
                    style={{ flexGrow: 1 }}
                >
                    <ButtonControlled className="rje-file__input" icon={icon} {...buttonProps} style={{ zIndex: 1 }}>
                        {filename ? <span className="rje-file__name">{filename}</span> : props.buttonText}
                    </ButtonControlled>
                    {filename && <Button className="rje-file__clear" variant="text" icon="close" onPress={onReset} />}
                </div>
            </div>
            <input
                type="file"
                style={nativeInputStyle}
                accept={props.accept}
                id={props.id}
                disabled={props.disabled}
                onChange={onChange}
                {...fieldProps}
            />
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
