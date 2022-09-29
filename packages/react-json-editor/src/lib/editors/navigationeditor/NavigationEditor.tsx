import Ref from '@semantic-ui-react/component-ref';
import Sortable from 'sortablejs';
import { editor } from '../decorators';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { JsonEditor } from '../../JsonEditor';
import { List, Accordion, Icon } from 'semantic-ui-react';
import { ParentNode, isValueNode, ArrayNode, DefaultNodeOptions, Node } from 'headless-json-editor';
import { useState, useRef, useEffect } from 'react';

function scrollTo(node: Node) {
    const pointer = node.pointer;
    const targetElement = document.querySelector(`[data-id="${pointer}"]`);
    if (targetElement == null) {
        return;
    }
    // https://github.com/sagold/editron/blob/master/src/services/LocationService.ts#L75
    // const scrollContainer = getScrollParent(targetElement);
    const bound = targetElement.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + bound.top);
}

function getNavigationTitle(node: Node) {
    return isValueNode(node) ? node.value : node.options.title ?? node.property;
}

type ArrayOptions = {
    sortable?: { enabled?: boolean };
} & DefaultNodeOptions;

function onSortEnd(instance: JsonEditor, node: ArrayNode, event: Sortable.SortableEvent) {
    const targetIndex = parseInt(`${event.newIndex}`);
    if (isNaN(targetIndex)) {
        return;
    }

    const { /*to,*/ from, oldIndex, /*newIndex,*/ item } = event;

    // always remove node - we create it from data
    item?.parentNode?.removeChild(item);

    // 1. if container or pointer (different editors) are the same, its a move within a list
    // 2. if item is dragged to the same position, but to another editor. now, the dragged
    // element is removeChild from original list. We readd it here, to fix this

    if (oldIndex != null) {
        // readd removed child - we move it through data
        from.insertBefore(event.item, from.childNodes[oldIndex]);
    }

    // change data
    instance.moveItem(`${node.pointer}/${event.oldIndex}`, targetIndex);
}

function ArrayChildNavigation({ node, instance }: { node: ArrayNode<ArrayOptions>; instance: JsonEditor }) {
    const ref = useRef<HTMLDivElement>();
    const [isModalOpen, setModalOpen] = useState(false);

    const [toggleState, setToggleState] = useState<boolean>(false);

    const { sortable = {} } = node.options;
    useEffect(() => {
        if (ref.current) {
            Sortable.create(ref.current, {
                handle: '.ed-nav-item__handle',
                swapThreshold: 4,
                ...sortable,
                onEnd: (event) => onSortEnd(instance, node, event)
            });
        }
    }, [instance, node, sortable]);

    return (
        <Accordion>
            <Accordion.Title active={toggleState}>
                <List.Content floated="right">
                    <Icon name="add" link onClick={(event) => setModalOpen(true)} />
                </List.Content>
                <List.Header className="clickable">
                    <Icon name="dropdown" link onClick={() => setToggleState(!toggleState)} />
                    <span onClick={() => scrollTo(node)}>{getNavigationTitle(node)}</span>
                </List.Header>
            </Accordion.Title>
            <Accordion.Content active={toggleState}>
                <Ref innerRef={ref}>
                    <List.List divided ref={ref} className="children">
                        {node.children.map((childchild: Node) => {
                            // @todo configurable title location for parent-nodes

                            return (
                                <List.Item key={childchild.id + 'nav'} style={{ display: 'flex' }}>
                                    <List.Content
                                        onClick={() => scrollTo(childchild)}
                                        style={{ flexGrow: 1 }}
                                        className="clickable"
                                    >
                                        {getNavigationTitle(childchild)}
                                    </List.Content>
                                    <List.Content floated="right" className="ed-nav-item__handle">
                                        <Icon link name="bars" />
                                    </List.Content>
                                </List.Item>
                            );
                        })}
                    </List.List>
                </Ref>
                <InsertItemModal
                    instance={instance}
                    node={node}
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                />
            </Accordion.Content>
        </Accordion>
    );
}

function ChildNavigation({ node, instance }: { node: Node; instance: JsonEditor }) {
    if (node.type === 'array') {
        return <ArrayChildNavigation node={node} instance={instance} />;
    }
    if (node.type === 'object') {
        return (
            <>
                <List.Header className="clickable" onClick={() => scrollTo(node)}>
                    {getNavigationTitle(node)}
                </List.Header>
                {/*<List.List divided>
                    {node.children.map((child: Node) => (
                        <List.Item key={child.id} style={{ display: 'flex' }}>
                            <List.Icon />
                            <List.Content onClick={() => scrollTo(child)}>{child.property}</List.Content>
                        </List.Item>
                    ))}
                </List.List>*/}
            </>
        );
    }
    return (
        <List.Header className="clickable" onClick={() => scrollTo(node)}>
            {getNavigationTitle(node)}
        </List.Header>
    );
}

/**
 * index editor
 *
 * - for overview + navigation
 * - inline as overview + detail?
 * - options: on node property or options property?
 */
export const NavigationEditor = editor<ParentNode>(({ node, instance }) => {
    return (
        <List divided relaxed="very">
            {node.children.map((child: Node) => (
                <List.Item key={child.id}>
                    <ChildNavigation node={child} instance={instance} />
                </List.Item>
            ))}
        </List>
    );
});

// export const NavigationEditorPlugin: EditorPlugin = {
//     id: 'navigation-editor',
//     use: (node) => node.schema.type === 'object',
//     Editor: NavigationEditor
// };
