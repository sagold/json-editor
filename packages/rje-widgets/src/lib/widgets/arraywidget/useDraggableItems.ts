import Sortable from 'sortablejs';
import { JsonEditor } from '@sagold/react-json-editor';
import { useEffect, RefObject } from 'react';

/** sortable options: https://github.com/SortableJS/Sortable */
export type SortableOptions = {
    enabled?: boolean;
    /** name of sortable group, defaults to json-pointer */
    group?: string;
};

export type DraggableItemsProps = {
    pointer: string;
    disabled?: boolean;
    readOnly?: boolean;
    sortable?: SortableOptions;
};

export function useDraggableItems(editor: JsonEditor, options: DraggableItemsProps, ref: RefObject<HTMLElement>) {
    const sortable: SortableOptions = {
        enabled: options.sortable?.enabled ?? false,
        group: options.sortable?.group ?? options.pointer
    };
    useEffect(() => {
        if (sortable?.enabled && ref.current && !options.disabled && !options.readOnly) {
            Sortable.create(ref.current, {
                handle: '.rje-drag__handle',
                swapThreshold: 4,
                // delay: 250,
                ...sortable,
                onEnd: createOnSortEnd(editor, options.pointer)
            });
        }
    }, [sortable, editor]);

    return {
        sortableEnabled: sortable.enabled
    };
}

function createOnSortEnd(editor: JsonEditor, pointer: string) {
    return function onSortEnd(event: Sortable.SortableEvent) {
        const targetIndex = parseInt(`${event.newIndex}`);
        if (isNaN(targetIndex)) {
            return;
        }
        const { to, from, oldIndex, newIndex, item } = event;
        // always remove node - we create it from data
        item?.parentNode?.removeChild(item);
        // 1. if container or pointer (different editors) are the same, its a move within a list
        // 2. if item is dragged to the same position, but to another editor. now, the dragged
        // element is removeChild from original list. We readd it here, to fix this
        if (oldIndex != null) {
            // readd removed child - we move it through data
            from.insertBefore(event.item, from.childNodes[oldIndex]);
        }
        // console.log('move item', `${node.pointer}/${event.oldIndex}`, targetIndex);
        editor.moveItem(`${pointer}/${event.oldIndex}`, targetIndex);
    };
}
