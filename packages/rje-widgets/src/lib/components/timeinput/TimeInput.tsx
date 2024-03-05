import { useRef, type RefObject } from 'react';
import { AriaTimeFieldProps, TimeValue, useLocale, useTimeField } from 'react-aria';
import { TimeFieldStateOptions, useTimeFieldState } from 'react-stately';
import { Label, WidgetError } from '@sagold/react-json-editor';
import { Segment } from '../dateinput/DateInput';
import { useTimeValue } from '../dateinput/useDateValue';
import { StringInput } from '../input/StringInput';
import { parseTime } from '@internationalized/date';

interface AriaTimeFieldOptions<T extends TimeValue> extends AriaTimeFieldProps<T> {
    /** A ref for the hidden input element for HTML form submission. */
    inputRef?: RefObject<HTMLInputElement>;
}

export type TimeInputProps = {
    title?: string;
    defaultValue?: string;
    value?: string;
    required?: boolean;
    error?: boolean;
    disabled?: boolean;
} & Omit<TimeFieldStateOptions, 'defaultValue' | 'value' | 'locale'> &
    Omit<AriaTimeFieldOptions<TimeValue>, 'defaultValue' | 'value' | 'locale'>;

export function TimeInput({ title, required, disabled, defaultValue, value, error, ...props }: TimeInputProps) {
    const { locale } = useLocale();
    const [defaultTime, time, parseError] = useTimeValue(defaultValue, value);
    const state = useTimeFieldState({
        ...props,

        defaultValue: defaultTime,
        value: time,
        locale
    });
    const ref = useRef<HTMLInputElement>(null);
    const { labelProps, fieldProps } = useTimeField({ ...props, label: title, defaultValue: defaultTime, value: time }, state, ref);

    if (parseError) {
        return (
            <div className="rje-time-input rje-time-input--error">
                <StringInput
                    title={title}
                    required={required}
                    defaultValue={defaultValue}
                    value={value}
                    error={true}
                    onChange={(value) => {
                        try {
                            const time = parseTime(value);
                            props.onChange?.(time);
                        } catch (e) {}
                    }}
                />
                <WidgetError errors={[parseError]} />
            </div>
        );
    }

    return (
        <div className="rje-time-input">
            {title && <Label {...labelProps} error={error} text={title} required={required} disabled={disabled} />}
            <div className="rje-date-input__fields" {...fieldProps} ref={ref}>
                {state.segments.map((segment, i) => (
                    <Segment key={i} segment={segment} state={state} />
                ))}
            </div>
        </div>
    );
}
