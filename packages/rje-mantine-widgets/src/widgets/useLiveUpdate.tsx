import { useState, useCallback } from 'react';
import { deepEqual } from '@sagold/react-json-editor';

export function useLiveUpdate<T = unknown, Event = any>(
    currentValue: T,
    setValue: (value: T) => void,
    retrieveValue: (event: Event) => T,
    liveUpdate?: boolean
) {
    /* --------------------------------
     * update onBlur
     * ------------------------------*/
    // track current state and expose value to input
    const [state, setState] = useState(currentValue);
    const onChange = useCallback((event: Event) => setState(retrieveValue(event) as T), [setState, retrieveValue]);

    // track initial value for changes and update internal state accordingly
    const [previousValue, setPreviousValue] = useState(currentValue);
    if (!deepEqual(previousValue, currentValue)) {
        setPreviousValue(currentValue);
        setState(currentValue);
    }

    /* --------------------------------
     * update on change (live)
     * ------------------------------*/
    const onLiveChange = useCallback((event: Event) => setValue(retrieveValue(event) as T), [setValue, retrieveValue]);
    if (liveUpdate === true) {
        return { value: currentValue, onChange: onLiveChange };
    }
    /* ---------------- */

    return {
        value: state,
        onChange,
        onBlur: () => setValue(state)
    };
}
