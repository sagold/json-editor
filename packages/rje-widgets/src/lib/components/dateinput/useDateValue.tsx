import { useMemo } from 'react';
import { parseDate, parseTime, parseAbsoluteToLocal, DateValue } from '@internationalized/date';
import type { DateInputProps } from './DateInput';

// there is a type issue with dateError as it is redeclared
export type { DateValue };

export function convertDateString(
    defaultValue: string | undefined,
    value: string | undefined,
    format?: DateInputProps['format']
): [DateValue | undefined, DateValue | undefined] {
    if (format === 'date') {
        return [defaultValue ? parseDate(defaultValue) : undefined, value ? parseDate(value) : undefined];
    }
    // else if (format === 'time') {
    //     return [defaultValue ? parseTime(defaultValue) : undefined, value ? parseTime(value) : undefined];
    // }
    return [
        defaultValue ? parseAbsoluteToLocal(defaultValue) : undefined,
        value ? parseAbsoluteToLocal(value) : undefined
    ];
}

export function useDateValue(
    defaultValue: string | undefined,
    value: string | undefined,
    format?: DateInputProps['format']
): [DateValue | undefined, DateValue | undefined] {
    const values = useMemo((...args) => convertDateString(defaultValue, value, format), [defaultValue, value]);
    return values;
}
