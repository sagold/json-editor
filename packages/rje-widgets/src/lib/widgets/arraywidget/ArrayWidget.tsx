import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Button, Icon, SemanticCOLORS } from 'semantic-ui-react';
import { JsonEditor, widget, WidgetPlugin, classNames } from '@sagold/react-json-editor';
import { useState, useRef, useEffect } from 'react';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { WidgetModalSize } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { ArrayItemCard, ArrayItemDefault } from './ArrayItem';
import Ref from '@semantic-ui-react/component-ref';
import { ValidationErrors } from '../../components/ValidationErrors';
import { ArrayActionPanel } from './ArrayActionPanel';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

export type ArrayOptions = {
    /** additional classnames for array editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    sortable?: {
        // sortable options: https://github.com/SortableJS/Sortable
        enabled?: boolean;
        group?: string; // name of sortable group, defaults to json-pointer
    };
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: WidgetModalSize;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline button at the end of the array to add another item */
    inlineAddItemOption?: boolean;
    /** ui layout options for array */
    layout?: {
        /** layout of array children, defaults */
        type?: 'cards' | 'default';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;

function createOnSortEnd(editor: JsonEditor, node: Node) {
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
        editor.moveItem(`${node.pointer}/${event.oldIndex}`, targetIndex);
    };
}

export const ArrayWidget = widget<ArrayNode<ArrayOptions>>(({ editor, node, options }) => {
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(options.collapsed != null ? !options.collapsed : true);
    let sortable = options.sortable;
    if (sortable == null) {
        sortable = { enabled: false };
    }
    sortable.enabled = sortable.enabled ?? false;
    sortable.group = sortable.group ?? node.pointer;

    const childOptions: Record<string, any> = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);

    function insertItem() {
        const options = editor.getArrayAddOptions(node);
        if (options.length === 1) {
            editor.appendItem(node, options[0]);
        } else {
            setModalOpen(true);
        }
        setShowContent(true);
    }

    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        if (sortable?.enabled && ref.current && !options.disabled && !options.readOnly) {
            Sortable.create(ref.current, {
                handle: '.ed-drag__handle',
                swapThreshold: 4,
                // delay: 250,
                ...sortable,
                onEnd: createOnSortEnd(editor, node)
            });
        }
    }, [sortable, editor]);

    const minItems = node.schema.minItems || 0;
    const { title, description, collapsed, editJson = {} } = options;
    const isDeleteEnabled = minItems < node.children.length;
    let isAddEnabled = node.schema.maxItems == null ? true : node.children.length < node.schema.maxItems;
    if (
        Array.isArray(node.schema.items) &&
        (node.schema.additionalItems === false || node.schema.additionalItems == null)
    ) {
        isAddEnabled = node.children.length < node.schema.items.length;
    }

    return (
        <div
            className={classNames('ed-form ed-form--parent ed-array', options.classNames)}
            data-type="array"
            data-id={node.pointer}
        >
            {(title || description || editJson.enabled || collapsed != null) && (
                <ParentHeader
                    node={node}
                    options={options}
                    icon={
                        options.collapsed != null && (
                            <Icon
                                link
                                rotated={!showContent ? 'counterclockwise' : undefined}
                                name="dropdown"
                                onClick={() => setShowContent(!showContent)}
                            />
                        )
                    }
                >
                    <ArrayActionPanel
                        editor={editor}
                        node={node}
                        options={options}
                        isAddEnabled={isAddEnabled}
                        insertItem={insertItem}
                    />
                </ParentHeader>
            )}

            <ValidationErrors errors={node.errors} />

            <Ref innerRef={ref}>
                <div className={`ed-array__items ed-array__items--${options.layout?.type ?? 'default'}`}>
                    {showContent &&
                        (options.layout?.type === 'cards'
                            ? node.children.map((child, index) => (
                                  <ArrayItemCard
                                      disabled={options.disabled || options.readOnly}
                                      editor={editor}
                                      key={child.id}
                                      node={child}
                                      size={node.children.length}
                                      withDragHandle={sortable?.enabled}
                                      options={childOptions}
                                      optional={isDeleteEnabled}
                                  />
                              ))
                            : node.children.map((child) => (
                                  <ArrayItemDefault
                                      disabled={options.disabled || options.readOnly}
                                      editor={editor}
                                      key={child.id}
                                      node={child}
                                      size={node.children.length}
                                      withDragHandle={sortable?.enabled}
                                      options={childOptions}
                                      optional={isDeleteEnabled}
                                  />
                              )))}
                </div>
            </Ref>
            {options.inlineAddItemOption !== false && (
                <div className={`rje-array__actions ${node.children.length % 2 ? 'even' : 'odd'}`}>
                    <Button icon="add" size="mini" color="black" onClick={insertItem} />
                </div>
            )}
            <InsertItemModal editor={editor} node={node} isOpen={openModal} onClose={() => setModalOpen(false)} />
        </div>
    );
});

export const ArrayWidgetPlugin: WidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
