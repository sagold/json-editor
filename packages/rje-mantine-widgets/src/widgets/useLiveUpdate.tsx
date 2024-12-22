import { useState, useEffect, useCallback } from 'react';

export function useLiveUpdate<T = unknown>(
    currentValue: T,
    setValue: (value: T) => void,
    liveUpdate?: boolean,
    retrieveValue?: (event: any) => T
) {
    const [state, setState] = useState(currentValue);
    useEffect(() => {
        // update state when defaultValue changes to support data changes outside of widget
        if (state !== currentValue) {
            setState(currentValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentValue, setState]);

    const onChange = useCallback(
        (event) => {
            const value = retrieveValue ? retrieveValue(event) : (event.currentTarget.value as T);
            setState(value);
            if (liveUpdate === true) {
                setValue(value);
            }
        },
        [setState, setValue, liveUpdate, retrieveValue]
    );
    return liveUpdate === true ? { value: state, onChange } : { value: state, onChange, onBlur: () => setValue(state) };
}
