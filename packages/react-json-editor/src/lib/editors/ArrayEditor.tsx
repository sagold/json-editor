import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import {
    Button,
    Container,
    Rail,
    Icon,
    Message,
    Popup,
    Accordion,
    Segment,
    Header,
    Grid,
    Menu
} from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import { JsonEditor } from '../JsonEditor';
import { useState, useRef, useEffect, createRef } from 'react';
import { InsertItemModal } from '../components/insertitemmodal/InsertItemModal';
import { EditJsonModal } from '../components/editjsonmodal/EditJsonModal';
import { split } from 'gson-pointer';
import Ref from '@semantic-ui-react/component-ref';

function getNodeDepth(node: Node, max = 6) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}

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
        <Grid data-type="array-item">
            <Grid.Column width="14">
                {withDragHandle && <div className="ed-array-item__handle"></div>}
                {children}
            </Grid.Column>
            <Grid.Column width="2" className="ed-array-item__actions" textAlign="right">
                <Popup trigger={<Button basic icon="ellipsis vertical" />} flowing hoverable>
                    <Button basic icon="trash alternate outline" onClick={() => instance.removeValue(node.pointer)} />
                    <Button
                        basic
                        icon="caret up"
                        disabled={node.property === '0'}
                        onClick={() => instance.moveItem(node.pointer, parseInt(node.property) - 1)}
                    />

                    <Button
                        basic
                        icon="caret down"
                        disabled={node.property === `${size - 1}`}
                        onClick={() => instance.moveItem(node.pointer, parseInt(node.property) + 1)}
                    />
                </Popup>
            </Grid.Column>
        </Grid>
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
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
} & DefaultNodeOptions;

export const ArrayEditor = editor<ArrayNode<ArrayOptions>>(({ instance, node, options }) => {
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);
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
            {options?.editJson && (
                <EditJsonModal
                    instance={instance}
                    node={node}
                    liveUpdate={options?.editJson?.liveUpdate}
                    isOpen={isEditModalOpen}
                    openEditModal={openEditModal}
                />
            )}
        </>
    );

    const header = (
        <Grid>
            <Grid.Column width="14">
                <Header as={`h${getNodeDepth(node)}`}>
                    {options.collapsed != null ? (
                        <Accordion.Title active={isOpen}>
                            <Icon name="dropdown" onClick={() => setToggleState(!isOpen)} />
                            <Header.Content>{options.title}</Header.Content>
                        </Accordion.Title>
                    ) : (
                        <Header.Content>{options.title}</Header.Content>
                    )}
                </Header>
            </Grid.Column>
            <Grid.Column width="2" textAlign="right">
                <Button.Group>
                    <Button icon="add" />
                    {options.editJson && <Button link icon="edit" onClick={() => openEditModal(true)} />}
                </Button.Group>
            </Grid.Column>
        </Grid>
    );

    if (options.collapsed == null) {
        return (
            <div data-type="array" data-id={node.pointer}>
                {header}
                {options.description && <p>{options.description as string}</p>}
                {content}
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
                {header}
                {options.description && <p>{options.description as string}</p>}
                <Accordion.Content active={isOpen}>{content}</Accordion.Content>
                <InsertItemModal
                    instance={instance}
                    node={node}
                    isOpen={openModal}
                    onClose={() => setModalOpen(false)}
                />
                {options?.editJson && (
                    <EditJsonModal
                        instance={instance}
                        node={node}
                        liveUpdate={options?.editJson?.liveUpdate}
                        isOpen={isEditModalOpen}
                        openEditModal={openEditModal}
                    />
                )}
            </Accordion>
        </Ref>
    );
});

export const ArrayEditorPlugin: EditorPlugin = {
    id: 'array-editor',
    use: (node) => node.schema.type === 'array',
    Editor: ArrayEditor
};
