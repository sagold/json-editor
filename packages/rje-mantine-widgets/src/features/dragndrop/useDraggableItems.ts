import Sortable from 'sortablejs';
import { Editor, isJsonError } from '@sagold/react-json-editor';
import { useEffect, RefObject } from 'react';
import { getParentArrayPointer } from './getParentArrayPointer';
import { splitLast } from '@sagold/json-pointer';

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

let slideBackIsPrevented = false;
/**
 * prevent slide back animation of canceled (or faked) drag-action
 */
export function preventSlideBackAnimation() {
    if (slideBackIsPrevented === true) {
        return;
    }
    document.addEventListener('dragover', (e) => e.preventDefault());
    slideBackIsPrevented = true;
}

type OriginContext = {
    itemPointer: string;
    index: number;
    arrayPointer: string;
    value: unknown;
};
function getOriginContext(event: Sortable.SortableEvent): OriginContext | undefined {
    const fromPointer = event.item.getAttribute('data-pointer');
    if (fromPointer == null) {
        return;
    }
    const [fromParent, fromIndex] = splitLast(fromPointer);
    const fromValue = retrieveDataValue(event.item);
    if (fromIndex == null) {
        return;
    }
    return {
        itemPointer: fromPointer,
        index: parseInt(fromIndex),
        arrayPointer: fromParent,
        value: fromValue
    };
}

type TargetContext = {
    itemPointer: string;
    index: number;
    arrayPointer: string;
};
function getTargetContext(event: Sortable.SortableEvent): TargetContext | undefined {
    const targetIndex = parseInt(`${event.newIndex}`);
    if (isNaN(targetIndex)) {
        return;
    }
    const targetPointer = getParentArrayPointer(event.to);
    if (targetPointer == undefined) {
        return;
    }
    return {
        itemPointer: `${targetPointer}/${targetIndex}`,
        index: targetIndex,
        arrayPointer: targetPointer
    };
}

function validateDropTarget(editor: Editor, from: OriginContext, to: TargetContext) {
    const targetNode = editor.getNode(to.arrayPointer);
    if (isJsonError(targetNode)) {
        return { errors: [targetNode], valid: false };
    }
    const toValue = editor.getData(to.arrayPointer) as unknown[];
    if (from.arrayPointer === to.arrayPointer) {
        // move within same array
        toValue.splice(from.index, 1);
        toValue.splice(to.index, 0, from.value);
    } else {
        // insert into another array
        toValue.splice(to.index, 0, from.value);
    }
    // TODO errors could be unrelated
    return targetNode.schemaNode.validate(toValue, to.arrayPointer);
}

export function useDraggableItems(
    editor: Editor | undefined,
    options: DraggableItemsProps,
    ref: RefObject<HTMLElement | null>
) {
    // const [sortableInstance, setSortableInstance] = useRef<Sortable>(undefined);
    const enabled = (options.sortable?.enabled && options.disabled !== true && options?.readOnly !== true) ?? false;
    const group = options.sortable?.group ?? options.pointer;
    useEffect(() => {
        if (editor && enabled && ref.current && !options.disabled && !options.readOnly) {
            const sortable = Sortable.create(ref.current, {
                handle: '.rje-drag__handle',
                swapThreshold: 4,
                ...options,
                group,
                // Element dragging ended
                onEnd: createOnSortEnd(editor, options.pointer),
                onStart: (event) => {
                    const origin = `${options.pointer}/${event.oldIndex}`;
                    event.item.setAttribute('data-pointer', origin);
                    event.item.setAttribute('data-value', JSON.stringify(editor.getData(origin)));
                },
                // Called when dragging element changes position
                onChange: (event) => {
                    const from = getOriginContext(event);
                    const to = getTargetContext(event);
                    if (from == null || to == null) {
                        return;
                    }
                    const { errors, valid } = validateDropTarget(editor, from, to);
                    event.item.classList.toggle('drag--invalid', !valid);
                    if (errors.length) {
                        event.item.setAttribute('data-errormessage', errors[0].message);
                        event.clone.setAttribute('data-errormessage', errors[0].message);
                    }
                }
            });
            return () => {
                sortable.destroy();
            };
        }
        return undefined;
    }, [editor, enabled, group, options, ref]);

    return {
        sortableEnabled: enabled
    };
}

export function useDraggableTemplates(
    editor: Editor | undefined,
    options: {
        group?: string;
        handle?: string;
    },
    element: RefObject<HTMLElement | null>
) {
    useEffect(() => {
        if (element.current && editor) {
            const sortable = Sortable.create(element.current, {
                swapThreshold: 1,
                animation: 1,
                delay: 1,
                sort: false,
                ...options,
                group: { name: options.group ?? 'undefined', pull: 'clone', put: false },
                onAdd: (event) => event.preventDefault(),
                onEnd(event: Sortable.SortableEvent) {
                    const to = getTargetContext(event);
                    if (to == null) {
                        return;
                    }

                    const { item } = event;
                    const targetArray = editor.getData(to.arrayPointer) as unknown[];
                    const value = retrieveDataValue(item);
                    targetArray.splice(to.index, 0, value);
                    editor.setValue(to.arrayPointer, targetArray);
                    // remove dragged html which got injected into dom
                    item.parentElement?.removeChild(item);
                }
            });
            return () => {
                sortable.destroy();
            };
        }
        return undefined;
    }, [element, editor, options]);
}

function retrieveDataValue(item: HTMLElement) {
    let value = item.getAttribute('data-value');
    if (value) {
        try {
            value = JSON.parse(value);
        } catch (e: any) {
            console.warn("failed converting attribute 'data-value' to json", e?.message);
        }
    }
    return value;
}

function createOnSortEnd(editor: Editor, fromPointer: string) {
    return function onSortEnd(event: Sortable.SortableEvent) {
        const { from: $from, oldIndex, item } = event;
        const to = getTargetContext(event);
        if (to == null || oldIndex == null) {
            return;
        }

        const from: OriginContext = {
            arrayPointer: fromPointer,
            index: oldIndex,
            itemPointer: `${fromPointer}/${oldIndex}`,
            value: editor.getData(`${fromPointer}/${oldIndex}`)
        };

        // always remove node - we create it from data
        item?.parentNode?.removeChild(item);
        event.item.classList.remove('drag--invalid');

        if (from.arrayPointer !== to.arrayPointer) {
            // 1. if container or pointer (different editors) are the same, its a move within a list
            // 2. if item is dragged to the same position, but to another editor. now, the dragged
            // element is removeChild from original list. We readd it here, to fix this
            // readd removed child - we move it through data
            $from.insertBefore(event.item, $from.childNodes[oldIndex]);

            const toValue = editor.getData(to.arrayPointer) as unknown[];
            // @TODO remove value must update (rerender) array
            editor.removeValue(from.itemPointer);
            toValue.splice(to.index, 0, from.value);
            editor.setValue(to.arrayPointer, toValue);
            return;
        }

        // 1. if container or pointer (different editors) are the same, its a move within a list
        // 2. if item is dragged to the same position, but to another editor. now, the dragged
        // element is removeChild from original list. We readd it here, to fix this
        if (oldIndex != null) {
            // readd removed child - we move it through data
            $from.insertBefore(event.item, $from.childNodes[oldIndex]);
        }
        editor.moveItem(from.itemPointer, to.index);
    };
}
