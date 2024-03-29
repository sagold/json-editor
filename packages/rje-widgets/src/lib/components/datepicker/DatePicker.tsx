import type { AriaDialogProps } from 'react-aria';
import { Button } from '../button/Button';
import { DateInputControlled, type DateInputProps } from '../dateinput/DateInput';
import { Label } from '../label/Label';
import { PopoverPortal } from '../popover/Popover';
import { useDatePicker, useDialog } from 'react-aria';
import { useDatePickerState } from 'react-stately';
import { useDateValue } from '../dateinput/useDateValue';
import { useRef } from 'react';
import { Calendar } from './Calendar';
import classNames from 'classnames';
import { type Calendar as TypeOfCalendar } from '@internationalized/date';

export type DatePickerProps = {
    error?: boolean;
    readOnly?: boolean;
    locale?: string;
    createCalendar?: (name: string) => TypeOfCalendar;
} & Omit<DateInputProps, 'locale' | 'createCalendar'>;

export function DatePicker({ title, error, format, defaultValue, value, required, readOnly, ...props }: DatePickerProps) {
    const [defaultDate, date] = useDateValue(defaultValue, value, format);
    const mainRef = useRef<HTMLDivElement>(null);
    const state = useDatePickerState({
        ...props,
        isReadOnly: readOnly,
        defaultValue: defaultDate,
        value: date
    });
    const inputWrapperRef = useRef(null);
    const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker(
        {
            ...props,
            label: title,
            isReadOnly: readOnly,
            isRequired: required,
            isDisabled: props.disabled,
            defaultValue: defaultDate,
            value: date
        },
        state,
        inputWrapperRef
    );

    return (
        <div
            className={classNames('rje-date-picker', {
                'rje-date-picker--readonly': readOnly,
                'rje-date-picker--disabled': props.disabled
            })}
            ref={mainRef}
        >
            {title && <Label {...labelProps} text={title} error={error} required={required} disabled={props.disabled} />}
            <div className="rje-date-picker__input" {...groupProps} ref={inputWrapperRef}>
                <DateInputControlled {...fieldProps} error={error} >
                    <Button variant="text" disabled={readOnly} {...buttonProps} icon="event" />
                </DateInputControlled>
            </div>
            {state.isOpen && (
                <PopoverPortal
                    overlayTriggerState={state}
                    overlayTriggerRef={inputWrapperRef}
                    placement="bottom start"
                    portalContainer={mainRef}
                >
                    <Dialog {...dialogProps}>
                        <Calendar {...calendarProps} />
                    </Dialog>
                </PopoverPortal>
            )}
        </div>
    );
}

interface DialogProps extends AriaDialogProps {
    title?: React.ReactNode;
    children: React.ReactNode;
}

function Dialog({ title, children, ...props }: DialogProps) {
    const ref = useRef(null);
    const { dialogProps, titleProps } = useDialog(props, ref);

    return (
        <div {...dialogProps} ref={ref}>
            {title && (
                <h3 {...titleProps} style={{ marginTop: 0 }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}
