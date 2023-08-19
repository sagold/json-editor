import { TagList, TagItem } from '../taglist/TagList';
import { useListData, Item, useComboBoxState } from 'react-stately';
import { useFilter, useComboBox, useFocus, useSelect } from 'react-aria';
import { Label } from '@sagold/react-json-editor';
import { useEffect, useRef, type Key, useState, RefObject } from 'react';
import { SelectOptionsControlled } from '../selectoptions/SelectOptions';
import { PopoverPortal } from '../popover/Popover';
import { on } from 'events';

export type { TagItem, Item, TagList };

/*
    variants:
        - allow duplicates
        - allow new entries (instead of selection only)

    components
        - TagListInputList: from multiple options select unique entry (same
            as TagList, but with additional search function)
        - TagListInputValue: free values to add with autocomplete (allow
            duplicates option)
*/

export type TagListInputProps = {
    title?: string;
    /* (controlled) */
    items?: TagItem[];
    /* (uncontrolled) */
    initialItems?: TagItem[];
    options?: TagItem[];
    /* (uncontrolled) */
    onChange?: (items: TagItem[]) => void;

    displayValue: (item: TagItem) => string;
    /*
        if allow duplicates:
        - new entry ids are managed by component
        - name is value

        if not allow duplicates
        - id is value
        -
    */
    onCreate?: (value: string, items: TagItem[]) => TagItem | false;
    onRemove?: (value: Set<Key>) => void;
};

export function TagListInput({
    items,
    initialItems = [],
    title,
    displayValue,
    onCreate,
    onRemove,
    onChange,
    options,
    ...props
}: TagListInputProps) {
    const currentValue = useRef('');
    const list = useListData({ initialItems });
    useEffect(() => {
        onChange?.(items ?? list.items);
    }, [list.items, onChange]);

    function resetInput() {
        state.setInputValue('');
        currentValue.current = '';
        if (inputRef?.current) {
            inputRef.current.value = '';
        }
    }

    const TagListInputRef = useRef(null);

    function addItem(name: string) {
        if (typeof name !== 'string' || name === '') {
            return;
        }
        // controlled
        if (items) {
            if (onCreate?.(name, items)) {
                resetInput();
            }
            return;
        }

        // uncontrolled
        const item = onCreate?.(name, list.items);
        if (item) {
            list.append(item);
            resetInput();
        }
    }

    const comboBoxProps = {
        ...props,
        items: items ?? list.items,
        allowsCustomValue: true,
        // items: options,
        defaultItems: options,
        children: (item) => <Item>{displayValue(item)}</Item>,
        onInputChange(inputString) {
            currentValue.current = inputString;
            // console.log('on-input-change', currentValue.current);
        },
        onSelectionChange: (key, ...args) => {
            // console.log('on-selection-change', currentValue.current);
            currentValue.current = key;
            addItem(currentValue.current);
        },
        // onOpenChange(value) {
        //     console.log('on-open-change', value);
        // },
        onKeyDown: (event) => {
            if (event.code === 'Enter') {
                // console.log('on-input-enter', currentValue.current);
                addItem(currentValue.current);
            }
        }
    };

    // Setup filter function and state.
    const { contains } = useFilter({ sensitivity: 'base' });
    // Setup refs and get props for child elements.
    const state = useComboBoxState({
        ...comboBoxProps,
        // searches selection text property for match
        defaultFilter: contains
    });

    // let buttonRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listBoxRef = useRef(null);
    const popoverRef = useRef(null);
    const { inputProps, labelProps, listBoxProps } = useComboBox(
        {
            ...comboBoxProps,
            defaultItems: options,
            inputRef,
            // buttonRef,
            listBoxRef,
            popoverRef
        },
        state
    );

    return (
        <div className="rje-tag-list-input" onClick={() => inputRef.current?.focus()} ref={TagListInputRef}>
            <Label
                {...labelProps}
                // onClick={(e) => {
                //     e.stopPropagation();
                //     e.preventDefault();
                //     console.log('focus label', inputRef.current);
                //     inputRef.current?.focus();
                // }}
            >
                {title}
            </Label>
            <TagList
                displayValue={displayValue}
                items={items ?? list.items}
                onRemove={(keys) => {
                    if (items) {
                        onRemove?.(keys);
                    } else {
                        list.remove(...keys);
                        console.log('remove', keys);
                    }
                }}
            >
                <input className="rje-tag-list-input__element" {...inputProps} ref={inputRef} />
            </TagList>

            {state.isOpen && (
                <PopoverPortal
                    portalContainer={TagListInputRef}
                    overlayTriggerState={state}
                    overlayTriggerRef={inputRef}
                    popoverRef={popoverRef}
                    isNonModal
                    placement="bottom start"
                >
                    <SelectOptionsControlled {...listBoxProps} listBoxRef={listBoxRef} state={state} />
                </PopoverPortal>
            )}
        </div>
    );
}
