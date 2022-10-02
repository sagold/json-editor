import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Button, Icon, Message, Popup, Accordion } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import { getEditorHeader } from '../utils/getEditorHeader';
import { JsonEditor } from '../JsonEditor';
import { useState, useRef, useEffect, createRef } from 'react';
import { InsertItemModal } from '../components/insertitemmodal/InsertItemModal';
import Ref from '@semantic-ui-react/component-ref';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

export type ArrayItemProps = {
    instance: JsonEditor;
    node: Node;
    size: number;
    children: JSX.Element;
    withDragHandle?: boolean;
};

function ArrayItem({ instance, node, withDragHandle, size, children }: ArrayItemProps) {
    return (
        <div data-type="array-item">
            {withDragHandle && <div className="ed-array-item__handle"></div>}
            {children}
            <div className="ed-array-item__actions">
                <Popup
                    trigger={
                        <Button basic icon>
                            <Icon name="ellipsis horizontal" />
                        </Button>
                    }
                    flowing
                    hoverable
                >
                    <Button basic icon onClick={() => instance.removeValue(node.pointer)}>
                        <Icon name="trash alternate outline" />
                    </Button>
                    <Button
                        basic
                        icon
                        disabled={node.property === '0'}
                        onClick={() => instance.moveItem(node.pointer, parseInt(node.property) - 1)}
                    >
                        <Icon name="caret up" />
                    </Button>
                    <Button
                        basic
                        icon
                        disabled={node.property === `${size - 1}`}
                        onClick={() => instance.moveItem(node.pointer, parseInt(node.property) + 1)}
                    >
                        <Icon name="caret down" />
                    </Button>
                </Popup>
            </div>
        </div>
    );
}

export type ArrayOptions = {
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    sortable?: {
        // sortable options: https://github.com/SortableJS/Sortable
        enabled?: boolean;
        group?: string; // name of sortable group, defaults to json-pointer
    };
} & DefaultNodeOptions;

export const ArrayEditor = editor<ArrayNode<ArrayOptions>>(({ instance, node, options }) => {
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [openModal, setModalOpen] = useState<boolean>(false);
    const contextRef = createRef();
    let sortable = options.sortable;
    if (sortable == null) {
        sortable = { enabled: false };
    }
    sortable.enabled = sortable.enabled ?? false;
    sortable.group = sortable.group ?? node.pointer;

    function insertItem() {
        const options = instance.getArrayAddOptions(node);
        if (options.length === 1) {
            instance.appendItem(node, options[0]);
        } else {
            setModalOpen(true);
        }
    }

    const ref = useRef<HTMLDivElement>();
    useEffect(() => {
        if (sortable?.enabled && ref.current) {
            // const sortable = Sortable.create(ref.current, {
            Sortable.create(ref.current, {
                handle: '.ed-array-item__handle',
                swapThreshold: 4,
                ...sortable,
                // Element dragging ended
                onEnd: function (event) {
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
                    instance.moveItem(`${node.pointer}/${event.oldIndex}`, targetIndex);
                }
            });
        }
    }, [sortable]);

    const Header = getEditorHeader(node);
    const content = (
        <>
            {node.errors.length > 0 && (
                <Message error>
                    <Message.List>
                        {node.errors.map((e) => {
                            return <Message.Item key={e.message}>{e.message}</Message.Item>;
                        })}
                    </Message.List>
                </Message>
            )}
            {/* @ts-ignore */}
            <div className="children" ref={ref}>
                {node.children.map((child) => {
                    const Node = instance.getEditor(child);
                    return (
                        <ArrayItem
                            node={child}
                            instance={instance}
                            size={node.children.length}
                            key={child.id}
                            withDragHandle={sortable?.enabled}
                        >
                            <Node node={child} instance={instance} />
                        </ArrayItem>
                    );
                })}
            </div>
        </>
    );

    if (options.collapsed == null) {
        return (
            <div data-type="array" data-id={node.pointer}>
                <Header>
                    {node.options.title && <div>{node.options.title}</div>}
                    <div>
                        <Button basic icon onClick={insertItem}>
                            <Icon name="add" />
                        </Button>
                    </div>
                </Header>
                {content}
                {options.description && <p>{options.description as string}</p>}
                <InsertItemModal
                    instance={instance}
                    node={node}
                    isOpen={openModal}
                    onClose={() => setModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <Ref innerRef={contextRef}>
            <Accordion data-type="array" data-id={node.pointer}>
                <Accordion.Title active={isOpen}>
                    <Header onClick={() => setToggleState(!isOpen)}>
                        <Icon name="dropdown" link />
                        {node.options.title && <div style={{ flexGrow: 1 }}>{node.options.title}</div>}
                        <div>
                            <Button basic icon onClick={insertItem}>
                                <Icon name="add" />
                            </Button>
                        </div>
                    </Header>
                    {options.description && <p>{options.description as string}</p>}
                </Accordion.Title>
                <Accordion.Content active={isOpen}>{content}</Accordion.Content>
                <InsertItemModal
                    instance={instance}
                    node={node}
                    isOpen={openModal}
                    onClose={() => setModalOpen(false)}
                />
            </Accordion>
        </Ref>
    );
});

export const ArrayEditorPlugin: EditorPlugin = {
    id: 'array-editor',
    use: (node) => node.schema.type === 'array',
    Editor: ArrayEditor
};
