import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Button, Icon, Message, SemanticCOLORS } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '../decorators';
import { JsonEditor } from '../../JsonEditor';
import { useState, useRef, useEffect } from 'react';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { ArrayItemCard, ArrayItemDefault } from './ArrayItem';
import { classNames } from '../../classNames';
import Ref from '@semantic-ui-react/component-ref';

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
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
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
    const [showContent, setShowContent] = useState<boolean>(options.collapsed != null ? !options.collapsed : true);
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);
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
                delay: 250,
                ...sortable,
                onEnd: createOnSortEnd(editor, node)
            });
        }
    }, [sortable, editor]);

    const { title, description, collapsed, editJson = {} } = options;

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
                    <Button basic icon="add" onClick={insertItem} />
                    {editJson.enabled && <Button basic icon="edit outline" onClick={() => openEditModal(true)} />}
                </ParentHeader>
            )}

            {node.errors.length > 0 && (
                <Message error>
                    <Message.List>
                        {node.errors.map((e) => (
                            <Message.Item key={e.message}>{e.message}</Message.Item>
                        ))}
                    </Message.List>
                </Message>
            )}

            <Ref innerRef={ref}>
                <div className={`ed-array__items ed-array__items--${options.layout?.type ?? 'default'}`}>
                    {showContent &&
                        (options.layout?.type === 'cards'
                            ? node.children.map((child) => (
                                  <ArrayItemCard
                                      disabled={options.disabled || options.readOnly}
                                      editor={editor}
                                      key={child.id}
                                      node={child}
                                      size={node.children.length}
                                      withDragHandle={sortable?.enabled}
                                      options={childOptions}
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
                                  />
                              )))}
                </div>
            </Ref>

            <InsertItemModal editor={editor} node={node} isOpen={openModal} onClose={() => setModalOpen(false)} />

            {editJson.enabled && (
                <WidgetModal
                    editor={editor}
                    node={node}
                    options={{ ...options, widget: 'json' }}
                    isOpen={isEditModalOpen}
                    closeModal={() => openEditModal(false)}
                />
            )}
        </div>
    );
});

export const ArrayWidgetPlugin: WidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
