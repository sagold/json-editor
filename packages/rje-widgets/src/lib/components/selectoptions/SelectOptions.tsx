import { CollectionChildren } from '@react-types/shared';
import { useRef, ReactNode } from 'react';
import { useListBox, useOption, useFocusRing, mergeProps, AriaListBoxProps } from 'react-aria';
import { Item, useListState, ListProps, ListState, SelectState } from 'react-stately';
import { Checkbox } from '../checkbox/Checkbox';
import classnames from 'classnames';
import { Label } from '../label/Label';

export { Item };

export type SelectOptionsControlledProps = {
    label?: ReactNode;
    state: ListState<object> | SelectState<object>;
    children?: CollectionChildren<object>;
} & Omit<AriaListBoxProps<object>, 'children'>;

export function SelectOptionsControlled({ state, ...props }: SelectOptionsControlledProps) {
    const ref = useRef<HTMLUListElement>(null);
    const { listBoxProps, labelProps } = useListBox(props, state, ref);
    return (
        <>
            <div {...labelProps}>{props.label}</div>
            <ul
                {...listBoxProps}
                className={`rje-select__options rje-select__options--${props.selectionMode ?? 'single'}`}
                ref={ref}
                style={{
                    padding: 0,
                    margin: '5px 0',
                    listStyle: 'none',
                    border: '1px solid gray',
                    maxWidth: 250,
                    maxHeight: 300,
                    overflow: 'auto'
                }}
            >
                {[...state.collection].map((item) => {
                    return <SelectOption key={item.key} item={item} state={state} />;
                })}
            </ul>
        </>
    );
}

export type SelectOptionsProps = {
    label?: string;
    children: CollectionChildren<object>;
    // # MultipleSelectionStateProps
    // /** How multiple selection should behave in the collection. */
    // selectionBehavior?: SelectionBehavior;
    // /** Whether onSelectionChange should fire even if the new set of keys is the same as the last. */
    // allowDuplicateSelectionEvents?: boolean;
    // /** Whether `disabledKeys` applies to all interactions, or only selection. */
    // disabledBehavior?: DisabledBehavior;
    // # ListProps
    // /** Filter function to generate a filtered list of nodes. */
    // filter?: (nodes: Iterable<Node<T>>) => Iterable<Node<T>>;
    // /** @private */
    // suppressTextValueWarning?: boolean;
} & AriaListBoxProps<object>;

SingleSelectOptions.Option = Item;
export function SingleSelectOptions(props: Omit<SelectOptionsProps, 'selectionMode'>) {
    const listConfig: ListProps<object> = {
        ...props,
        selectionMode: 'single'
    };
    const state = useListState(listConfig);
    return <SelectOptionsControlled {...listConfig} state={state} />;
}

MultiSelectOptions.Option = Item;
export function MultiSelectOptions(props: Omit<SelectOptionsProps, 'selectionMode'>) {
    const listConfig: ListProps<object> = {
        ...props,
        selectionMode: 'multiple'
    };
    const state = useListState(listConfig);
    return <SelectOptionsControlled {...listConfig} state={state} />;
}

export type SelectOptionProps = {
    item: any;
    state: ListState<object> | SelectState<object>;
} & Omit<AriaListBoxProps<object>, 'children'>;

function SelectOption({ item, state }: SelectOptionProps) {
    const mode = state.selectionManager.selectionMode;
    // Get props for the option element
    const ref = useRef(null);
    const { optionProps, isSelected, isDisabled, isFocused } = useOption({ key: item.key }, state, ref);
    // Determine whether we should show a keyboard focus ring for accessibility
    const { isFocusVisible, focusProps } = useFocusRing();
    return (
        <li
            {...mergeProps(optionProps, focusProps)}
            className={classnames(
                'rje-select__option',
                isSelected ? 'rje-select__option--selected' : 'rje-select__option--unselected',
                isDisabled ? 'rje-select__option--disabled' : 'rje-select__option--enabled',
                isFocusVisible ? 'rje-select__option--focused' : 'rje-select__option--unfocused'
            )}
            ref={ref}
        >
            {mode === 'multiple' ? (
                <Checkbox isSelected={isSelected} disabled={isDisabled}>
                    {item.rendered}
                </Checkbox>
            ) : (
                <Label
                    className={classnames(
                        'select__option',
                        isSelected ? 'select__option--selected' : 'select__option--unselected'
                    )}
                    disabled={isDisabled}
                >
                    {item.rendered}
                </Label>
            )}
        </li>
    );
}
