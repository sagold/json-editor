import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Button, Icon, Modal, Dropdown, Message, Popup, DropdownProps } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import { getEditorHeader } from '../utils/getEditorHeader';
import { JsonEditor } from '../JsonEditor';
import { JSONSchema, isJSONError } from 'json-schema-library';
import { useState, useRef, useEffect } from 'react';

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
    sortable?: {
        // sortable options: https://github.com/SortableJS/Sortable
        enabled?: boolean;
        group?: string; // name of sortable group, defaults to pointer
    };
} & DefaultNodeOptions;

export const ArrayEditor = editor<ArrayNode<ArrayOptions>>(({ node, instance }) => {
    const [modal, setModal] = useState<{ open: boolean; options: JSONSchema[]; selected: number }>({
        open: false,
        options: [],
        selected: 0
    });
    const openModal = (options: JSONSchema[]) => setModal({ open: true, options, selected: 0 });
    const closeModal = () => setModal({ open: false, options: [], selected: 0 });
    const Header = getEditorHeader(node);

    function addItem() {
        const options = instance.getArrayAddOptions(node);
        if (isJSONError(options)) {
            return;
        }
        if (options.length === 1) {
            instance.appendItem(node, options[0]);
        } else {
            openModal(options);
        }
    }

    function addSelectedItem() {
        instance.appendItem(node, modal.options[modal.selected]);
        closeModal();
    }

    const handleSelection = (event, { value }: DropdownProps) => setModal({ ...modal, selected: parseInt(`${value}`) });
    let sortable = node.options.sortable;
    if (sortable == null) {
        sortable = { enabled: true };
    }

    sortable.enabled = sortable.enabled ?? false;
    sortable.group = sortable.group ?? node.pointer;

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

                    instance.moveItem(`${node.pointer}/${event.oldIndex}`, targetIndex);
                }
            });
        }
    }, [sortable]);

    return (
        <div data-type="array">
            <Header>
                {node.options.title}
                <Button basic icon onClick={addItem}>
                    <Icon name="add" />
                </Button>
            </Header>
            <p>{node.schema.description as string}</p>
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
            <Modal open={modal.open} onClose={closeModal}>
                <Modal.Header>Select new array item</Modal.Header>
                <Modal.Content>
                    <Dropdown
                        onChange={handleSelection}
                        defaultValue={0}
                        options={modal.options.map((o, index) => ({
                            key: o.id,
                            value: index,
                            text: o.title
                        }))}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={closeModal}>
                        cancel
                    </Button>
                    <Button color="black" onClick={addSelectedItem}>
                        create
                    </Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
});

export const ArrayEditorPlugin: EditorPlugin = {
    id: 'array-editor',
    use: (node) => node.schema.type === 'array',
    Editor: ArrayEditor
};
