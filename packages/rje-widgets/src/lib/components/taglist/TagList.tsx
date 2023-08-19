import { useRef, type Key, type ReactNode } from 'react';
import type { ListState, Selection, SelectionMode } from 'react-stately';
import type { AriaTagGroupProps, AriaTagProps } from 'react-aria';
import { Item, useListState } from 'react-stately';
import { useFocusRing, useTag, useTagGroup } from 'react-aria';
import { Button } from '../button/Button';
import { Label } from '../label/Label';
import classnames from 'classnames';

export { Item };

TagList.Item = Item;

export type TagItem = {
    id: Key;
    [p: string]: any;
};

const renderItemId = (item: { id: Key }) => `${item.id}`;

export type TagListProps = {
    title?: string;
    /* true to disable tag group */
    disabled?: boolean;
    /* true to mark tag group as required */
    required?: boolean;
    /* true to show tag group in error state */
    error?: boolean;
    children?: ReactNode | ReactNode[];
    /** Handler that is called when a user deletes a tag.  */
    onRemove?: (keys: Set<Key>) => void;
    displayValue?: (item: TagItem) => string;
    /** Initial items in the list. */
    items?: TagItem[];
    /** The type of selection that is allowed in the collection. */
    selectionMode?: SelectionMode;
    /** Whether the collection allows empty selection. */
    // disallowEmptySelection?: boolean;
    /** The currently selected keys in the collection (controlled). */
    selectedKeys?: 'all' | Iterable<Key>;
    /** The initial selected keys in the collection (uncontrolled). */
    defaultSelectedKeys?: 'all' | Iterable<Key>;
    /** Handler that is called when the selection changes. */
    onSelectionChange?: (keys: Selection) => any;
    /** The currently disabled keys in the collection (controlled). */
    // disabledKeys?: Iterable<Key>;
} & Omit<
    AriaTagGroupProps<TagItem>,
    | 'items'
    | 'children'
    | 'selectionMode'
    | 'selectedKeys'
    | 'defaultSelectedKeys'
    | 'onSelectionChange'
    | 'description'
    | 'errorMessage'
    | 'onRemove'
>;

export function TagList({
    disabled,
    required,
    error,
    title,
    children,
    displayValue = renderItemId,
    ...props
}: TagListProps) {
    const ref = useRef(null);
    const state = useListState<TagItem>({
        ...props,
        children: (item) => <Item>{displayValue(item)}</Item>
    });

    const { gridProps, labelProps } = useTagGroup(
        {
            ...props,
            label: title
        },
        state,
        ref
    );
    return (
        <div className="rje-tag-list">
            {title && <Label {...labelProps} disabled={disabled} required={required} error={error} text={title} />}
            <div {...gridProps} ref={ref} className="rje-tag-list__children">
                {[...state.collection].map((item) => (
                    <Tag key={item.key} item={item} state={state} />
                ))}
                {children}
            </div>
        </div>
    );
}

type TagProps = {
    state: ListState<TagItem>;
} & AriaTagProps<TagItem>;

function Tag(props: TagProps) {
    let { item, state } = props;
    let ref = useRef(null);
    let { focusProps, isFocusVisible } = useFocusRing({ within: true });
    let { rowProps, gridCellProps, removeButtonProps, allowsRemoving } = useTag(props, state, ref);

    return (
        <div
            ref={ref}
            {...rowProps}
            {...focusProps}
            data-focus-visible={isFocusVisible}
            className={classnames('rje-tag', {
                'with-action': allowsRemoving
            })}
        >
            <div {...gridCellProps} className="rje-tag__grid">
                {item.rendered}
                {allowsRemoving && <Button {...removeButtonProps} variant="text" icon="clear" />}
            </div>
        </div>
    );
}
