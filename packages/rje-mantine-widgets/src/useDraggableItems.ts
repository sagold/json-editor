import Sortable from 'sortablejs';
import { Editor } from '@sagold/react-json-editor';
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

export function useDraggableItems(editor: Editor, options: DraggableItemsProps, ref: RefObject<HTMLElement | null>) {
    const enabled = (options.sortable?.enabled && options.disabled !== true && options?.readOnly !== true) ?? false;
    const group = options.sortable?.group ?? options.pointer;
    useEffect(() => {
        if (enabled && ref.current && !options.disabled && !options.readOnly) {
            Sortable.create(ref.current, {
                handle: '.rje-drag__handle',
                swapThreshold: 4,
                // delay: 250,
                group,
                onEnd: createOnSortEnd(editor, options.pointer)
            });
        }
    }, [editor, enabled, group, options, ref]);

    return {
        sortableEnabled: enabled
    };
}

export function getArrayPointer(element: HTMLElement) {
    let parent = element.parentElement;
    while (parent != null && parent !== document.body) {
        if (parent.getAttribute('data-type') === 'array') {
            return parent.getAttribute('data-id');
        }
        parent = parent.parentElement;
    }
    return undefined;
}

function createOnSortEnd(editor: Editor, fromPointer: string) {
    return function onSortEnd(event: Sortable.SortableEvent) {
        const targetIndex = parseInt(`${event.newIndex}`);
        if (isNaN(targetIndex)) {
            return;
        }
        const { from, oldIndex, item, to } = event;

        const targetPointer = getArrayPointer(to);
        if (targetPointer == undefined) {
            console.error('array widget failed resolving target pointer of', to);
            return;
        }

        // always remove node - we create it from data
        item?.parentNode?.removeChild(item);

        if (fromPointer !== targetPointer) {
            // 1. if container or pointer (different editors) are the same, its a move within a list
            // 2. if item is dragged to the same position, but to another editor. now, the dragged
            // element is removeChild from original list. We readd it here, to fix this
            if (oldIndex != null) {
                // readd removed child - we move it through data
                from.insertBefore(event.item, from.childNodes[oldIndex]);
            }

            const fromValue = editor.getData(`${fromPointer}/${oldIndex}`);
            const toValue = editor.getData(targetPointer) as unknown[];
            // @TODO remove value must update (rerender) array
            editor.removeValue(`${fromPointer}/${oldIndex}`);
            toValue.splice(targetIndex, 0, fromValue);
            editor.setValue(targetPointer, toValue);
            return;
        }

        // 1. if container or pointer (different editors) are the same, its a move within a list
        // 2. if item is dragged to the same position, but to another editor. now, the dragged
        // element is removeChild from original list. We readd it here, to fix this
        if (oldIndex != null) {
            // readd removed child - we move it through data
            from.insertBefore(event.item, from.childNodes[oldIndex]);
        }
        editor.moveItem(`${fromPointer}/${event.oldIndex}`, targetIndex);
    };
}
