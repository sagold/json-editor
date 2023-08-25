import { useMemo } from 'react';
import {
    parseDate,
    parseTime,
    parseAbsoluteToLocal,
    // parseAbsolute,
    DateValue,
    Time
} from '@internationalized/date';
import type { DateInputProps } from './DateInput';
import { JsonError } from '@sagold/react-json-editor';

// there is a type issue with dateError as it is redeclared
export type { DateValue };

export function convertDateString(
    defaultValue: string | undefined,
    value: string | undefined,
    format?: DateInputProps['format']
): [DateValue | undefined, DateValue | undefined, JsonError?] {
    try {
        if (format === 'date') {
            return [defaultValue ? parseDate(defaultValue) : undefined, value ? parseDate(value) : undefined];
        }
    } catch (error) {
        const err: JsonError = {
            type: 'error',
            code: `unsupported-date-format`,
            name: 'UnsuportedDateFormat',
            message: `${defaultValue || value} is not a supported date-format. Valid format is YYYY:MM:DD`,
            data: { defaultValue, value, pointer: '', schema: {} }
        };
        return [undefined, undefined, err];
    }
    try {
        return [
            defaultValue ? parseAbsoluteToLocal(defaultValue) : undefined,
            value ? parseAbsoluteToLocal(value) : undefined
        ];
    } catch (error) {
        const err: JsonError = {
            type: 'error',
            code: `unsupported-datetime-format`,
            name: 'UnsuportedDateFormat',
            message: `${
                defaultValue || value
            } is not a supported datetime-format. Valid format is YYYY:MM:DDTHH:mm:ssZ`,
            data: { defaultValue, value, pointer: '', schema: {} }
        };
        return [undefined, undefined, err];
    }
}

export function useDateValue(
    defaultValue: string | undefined,
    value: string | undefined,
    format?: DateInputProps['format']
): [DateValue | undefined, DateValue | undefined, JsonError?] {
    const values = useMemo((...args) => convertDateString(defaultValue, value, format), [defaultValue, value]);
    return values;
}

export function useTimeValue(
    defaultValue: string | undefined,
    value: string | undefined
): [Time | undefined, Time | undefined, JsonError?] {
    const values: [Time | undefined, Time | undefined, JsonError?] = useMemo(
        (...args) => {
            try {
                return [defaultValue ? parseTime(defaultValue) : undefined, value ? parseTime(value) : undefined];
            } catch (error) {
                const err: JsonError = {
                    type: 'error',
                    code: 'unsupported-time-format',
                    name: 'UnsuportedTimeFormat',
                    message: `${defaultValue || value} is not a supported time-format. Valid format is HH:mm:ss`,
                    data: { defaultValue, value, pointer: '', schema: {} }
                };
                return [undefined, undefined, err];
            }
        },
        [defaultValue, value]
    );
    return values;
}
