import { Radio } from '@mantine/core';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const useWindowEvent = (event, callback) => {
    useEffect(() => {
        window.addEventListener(event, callback);
        return () => window.removeEventListener(event, callback);
    }, [event, callback]);
};

export const SelectionContext = createContext<{
    selected: string | undefined;
    set: (pointer: string | undefined) => void;
}>({
    selected: '',
    set(pointer) {
        this.selected = pointer;
    }
});

export function SelectionProvider({
    children,
    onSelect
}: {
    children: ReactNode;
    onSelect?: (pointer: string | undefined) => void;
}) {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const unselect = useCallback(() => setSelected(undefined), [setSelected]);
    useEffect(() => {
        onSelect?.(selected);
    }, [onSelect, selected]);
    useWindowEvent('click', unselect);
    return <SelectionContext value={{ selected, set: setSelected }}> {children} </SelectionContext>;
}

export function SelectionIcon({ pointer }: { pointer: string }) {
    const selection = useContext(SelectionContext);
    return (
        <Radio
            checked={selection.selected === pointer}
            onClick={(event) => {
                selection.set(pointer);
                event.stopPropagation();
            }}
        />
    );
}
