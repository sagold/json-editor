import { Radio } from '@mantine/core';
import { createContext, ReactNode, use, useCallback, useContext, useEffect, useState } from 'react';

const useWindowEvent = (event: string, callback: EventListener) => {
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

export type OnSelectHandler = (pointer: string | undefined) => void;

export function SelectionProvider({ children, onSelect }: { children: ReactNode; onSelect?: OnSelectHandler }) {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const unselect = useCallback(() => setSelected(undefined), [setSelected]);
    useEffect(() => {
        onSelect?.(selected);
    }, [onSelect, selected]);
    useWindowEvent('click', unselect);
    return <SelectionContext value={{ selected, set: setSelected }}> {children} </SelectionContext>;
}

/**
 * @returns [isSelected: boolean, onSelectHandler: undefined|(event: MouseEvent) => void]
 */
export function useSelect(pointer: string, selectable: boolean | undefined) {
    if (selectable) {
        const selection = use(SelectionContext);
        return [
            selection.selected === pointer,
            (event: MouseEvent) => {
                event.stopPropagation();
                event.preventDefault();
                selection.set(pointer);
            }
        ];
    }
    return [false, undefined];
}

export function SelectionIcon({ pointer }: { pointer: string }) {
    const selection = useContext(SelectionContext);
    return (
        <Radio
            style={{ '--mantine-scale': '0.7' }}
            checked={selection.selected === pointer}
            onClick={(event) => {
                selection.set(pointer);
                event.stopPropagation();
            }}
        />
    );
}
