import Sortable from 'sortablejs';
import { ArrayNode, Node, DefaultNodeOptions } from 'headless-json-editor';
import { Icon, Message, Accordion, Segment, Header, Grid, SemanticCOLORS } from 'semantic-ui-react';
import { editor, EditorPlugin } from '../decorators';
import { JsonEditor } from '../../JsonEditor';
import { useState, useRef, useEffect } from 'react';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { EditJsonModal } from '../../components/editjsonmodal/EditJsonModal';
import { split } from 'gson-pointer';
import { ArrayItemCard, ArrayItemGrid } from './ArrayItem';
import Ref from '@semantic-ui-react/component-ref';

function getNodeDepth(node: Node, max = 6) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/index.ts
// and https://github.com/sueddeutsche/editron/blob/master/src/editors/arrayeditor/ArrayItem.ts

export type ArrayItemProps = {
    instance: JsonEditor;
    node: ArrayNode;
    child: Node;
    size: number;
    children: JSX.Element;
    withDragHandle?: boolean;
};

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
    /** ui layout options for array */
    layout: {
        /** layout of array children, defaults */
        type?: 'cards' | 'grid';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;

function createOnSortEnd(instance: JsonEditor, node: Node) {
    return function onSortEnd(event: Sortable.SortableEvent) {
        console.log('end sorting');
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
    };
}

export const ArrayEditor = editor<ArrayNode<ArrayOptions>>(({ instance, node, options }) => {
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [openModal, setModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);
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
            console.log('init sortable', node);
            Sortable.create(ref.current, {
                handle: '.ed-array-item__handle',
                swapThreshold: 4,
                ...sortable,
                onEnd: createOnSortEnd(instance, node)
            });
        }
    }, [sortable, instance]);

    const { title, description, collapsed, editJson } = options;
    const { inverted = false, color } = options.header ?? {};

    const ArrayItem = options.layout?.type === 'cards' ? ArrayItemCard : ArrayItemGrid;

    return (
        <Accordion data-type="array" data-id={node.pointer}>
            {(title || description || editJson || collapsed != null) && (
                <Accordion.Title inverted={inverted} active={isOpen}>
                    <Segment basic inverted={inverted} color={color}>
                        <Grid columns="equal">
                            <Grid.Column>
                                <Header as={`h${getNodeDepth(node)}`} inverted={inverted}>
                                    {collapsed != null && (
                                        <Header.Content floated="left">
                                            <Icon name="dropdown" onClick={() => setToggleState(!isOpen)} />
                                        </Header.Content>
                                    )}
                                    <Header.Content>{title}</Header.Content>
                                    <Header.Subheader>{description}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            <Grid.Column width="1" textAlign="right">
                                <Icon link name="add" onClick={insertItem} />
                                {editJson && <Icon link name="edit" onClick={() => openEditModal(true)} />}
                            </Grid.Column>
                        </Grid>
                    </Segment>
                </Accordion.Title>
            )}

            {node.errors.length > 0 && (
                <Message error>
                    <Message.List>
                        {node.errors.map((e) => {
                            return <Message.Item key={e.message}>{e.message}</Message.Item>;
                        })}
                    </Message.List>
                </Message>
            )}

            <Ref innerRef={ref}>
                <Accordion.Content active={isOpen} className="children">
                    {node.children.map((child) => (
                        <ArrayItem
                            instance={instance}
                            node={child}
                            size={node.children.length}
                            key={child.id}
                            withDragHandle={sortable?.enabled}
                        />
                    ))}
                </Accordion.Content>
            </Ref>

            <InsertItemModal instance={instance} node={node} isOpen={openModal} onClose={() => setModalOpen(false)} />

            {editJson && (
                <EditJsonModal
                    instance={instance}
                    node={node}
                    liveUpdate={editJson.liveUpdate}
                    isOpen={isEditModalOpen}
                    openEditModal={openEditModal}
                />
            )}
        </Accordion>
    );
});

export const ArrayEditorPlugin: EditorPlugin = {
    id: 'array-editor',
    use: (node) => node.schema.type === 'array',
    Editor: ArrayEditor
};
