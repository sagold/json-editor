import { useRef, type ReactNode } from 'react';
import { DateFieldState, DateFieldStateOptions, DateSegment, useDateFieldState } from 'react-stately';
import { useDateField, useDateSegment, useLocale } from 'react-aria';
import { Calendar, createCalendar } from '@internationalized/date';
import { Label } from '../label/Label';
import classNames from 'classnames';
import type { AriaDateFieldProps } from 'react-aria';
import { useDateValue, DateValue } from './useDateValue';

export type Granularity = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export type DateInputProps = {
    title?: string;
    children?: ReactNode | ReactNode[];
    disabled?: boolean;
    error?: boolean;
    readOnly?: boolean;
    required?: boolean;
    /* defaults to date-time */
    format?: 'date' | 'date-time';
    /**
     * The maximum unit to display in the date field.
     * @default 'year'
     */
    maxGranularity?: Granularity;
    granularity?: Granularity;
    defaultValue?: string;
    value?: string;
    // onChange?: (datetime: Date) => void;
    onChange?: (date: DateValue) => void;
    /** The locale to display and edit the value according to. */
    locale?: string;
} & Omit<DateFieldStateOptions, 'defaultValue' | 'value'> &
    Omit<AriaDateFieldProps<DateValue>, 'defaultValue' | 'value'>;

export function DateInput({
    defaultValue,
    value,
    format,
    title,
    required,
    disabled,
    readOnly,
    ...props
}: DateInputProps) {
    const [defaultDate, date] = useDateValue(defaultValue, value, format);
    const dateInputProps: DateInputControlledProps = {
        ...props,
        defaultValue: defaultDate,
        value: date,
        label: title,
        isRequired: required,
        isDisabled: disabled,
        isReadOnly: readOnly
    };
    return <DateInputControlled {...dateInputProps} />;
}

export type DateInputControlledProps = {
    error?: boolean;
    children?: ReactNode | ReactNode[];
    local?: string;
    createCalendar?: (name: string) => Calendar;
} & Omit<DateFieldStateOptions, 'locale' | 'createCalendar'> &
    AriaDateFieldProps<DateValue>;

export function DateInputControlled({ children, error, ...props }: DateInputControlledProps) {
    const { locale } = useLocale();
    // https://react-spectrum.adobe.com/react-stately/useDateFieldState.html#interface
    const state = useDateFieldState({
        ...props,
        locale,
        createCalendar
    });
    // const hasValidationError = state.validationState === 'invalid';
    const ref = useRef(null);
    const { labelProps, fieldProps } = useDateField(props, state, ref);
    return (
        <div
            className={classNames('rje-date-input', {
                'rje-date-input--readonly': props.isReadOnly,
                'rje-date-input--disabled': props.isDisabled,
                'rje-date-input--invalid': error
            })}
        >
            {props.label && (
                <Label {...labelProps} text={props.label} required={props.isRequired} disabled={props.isDisabled} error={error} />
            )}
            <div className="rje-date-input__fields" {...fieldProps} ref={ref}>
                {state.segments.map((segment, index) => (
                    <Segment key={index} segment={segment} state={state} />
                ))}
                {children}
            </div>
        </div>
    );
}

type DateSegmentProps = {
    segment: DateSegment;
    state: DateFieldState;
};

export function Segment({ segment, state }: DateSegmentProps) {
    const ref = useRef(null);
    const { segmentProps } = useDateSegment(segment, state, ref);
    return (
        <div
            {...segmentProps}
            ref={ref}
            className={classNames('rje-date-input__segment', {
                'rje-date-input__segment--placeholder': segment.isPlaceholder,
                'rje-date-input__segment--value': !segment.isPlaceholder && segment.isEditable
            })}
        >
            {segment.text}
        </div>
    );
}
