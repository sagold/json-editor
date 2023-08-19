import type { AriaDialogProps } from 'react-aria';
import { Button } from '../button/Button';
import { DateInputControlled, type DateInputProps } from '../dateinput/DateInput';
import { Label } from '../label/Label';
import { PopoverPortal } from '../popover/Popover';
import { useDatePicker } from 'react-aria';
import { useDatePickerState } from 'react-stately';
import { useDateValue } from '../dateinput/useDateValue';
import { useDialog } from 'react-aria';
import { useRef } from 'react';
import { Calendar } from './Calendar';
import { type Calendar as TypeOfCalendar } from '@internationalized/date';

export type DatePickerProps = {
    error?: boolean;
    locale?: string;
    createCalendar?: (name: string) => TypeOfCalendar;
} & Omit<DateInputProps, 'locale' | 'createCalendar'>;

export function DatePicker({ title, error, format, defaultValue, value, ...props }: DatePickerProps) {
    const [defaultDate, date] = useDateValue(defaultValue, value, format);
    const mainRef = useRef<HTMLDivElement>(null);
    const state = useDatePickerState({
        ...props,
        defaultValue: defaultDate,
        value: date
    });
    const inputWrapperRef = useRef(null);
    const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps } = useDatePicker(
        {
            ...props,
            defaultValue: defaultDate,
            value: date
        },
        state,
        inputWrapperRef
    );

    // console.log('string', defaultDate && defaultDate.toString(), date && date.toString());
    // console.log(fieldProps?.value?.toDate().toISOString());

    return (
        <div className="rje-date-picker" ref={mainRef}>
            {title && <Label {...labelProps} text={title} />}
            <div className="rje-date-picker__input" {...groupProps} ref={inputWrapperRef}>
                <DateInputControlled {...fieldProps}>
                    <Button variant="text" {...buttonProps} icon="event" />
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
    let ref = useRef(null);
    let { dialogProps, titleProps } = useDialog(props, ref);

    return (
        <div {...dialogProps} ref={ref} style={{ padding: 30 }}>
            {title && (
                <h3 {...titleProps} style={{ marginTop: 0 }}>
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
}
