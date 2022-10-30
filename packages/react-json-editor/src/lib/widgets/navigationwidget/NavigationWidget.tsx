import Ref from '@semantic-ui-react/component-ref';
import Sortable from 'sortablejs';
import { widget } from '../decorators';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { JsonEditor } from '../../JsonEditor';
import { List, Accordion, Icon } from 'semantic-ui-react';
import { ParentNode, ArrayNode, DefaultNodeOptions, Node, isJSONError } from 'headless-json-editor';
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
    return node.options.title ?? node.property;
}

type ArrayOptions = {
    sortable?: { enabled?: boolean };
} & DefaultNodeOptions;

function onSortEnd(editor: JsonEditor, node: ArrayNode, event: Sortable.SortableEvent) {
    const targetIndex = parseInt(`${event.newIndex}`);
    if (isNaN(targetIndex)) {
        return;
    }

    const { /*to,*/ from, oldIndex, /*newIndex,*/ item } = event;

    // always remove node - we create it from data
    item?.parentNode?.removeChild(item);

    // 1. if container or pointer (different widgets) are the same, its a move within a list
    // 2. if item is dragged to the same position, but to another widget. now, the dragged
    // element is removeChild from original list. We readd it here, to fix this

    if (oldIndex != null) {
        // readd removed child - we move it through data
        from.insertBefore(event.item, from.childNodes[oldIndex]);
    }

    // change data
    editor.moveItem(`${node.pointer}/${event.oldIndex}`, targetIndex);
}

function ArrayChildNavigation({ node, editor }: { node: ArrayNode<ArrayOptions>; editor: JsonEditor }) {
    const ref = useRef<HTMLDivElement>();
    const [isModalOpen, showSelectItemModal] = useState(false);
    const [toggleState, setToggleState] = useState<boolean>(false);

    const { sortable = {}, disabled = false, readOnly = false } = node.options;
    const useActions = !disabled && !readOnly;
    useEffect(() => {
        if (ref.current && !disabled && !readOnly) {
            Sortable.create(ref.current, {
                handle: '.ed-nav-item__handle',
                swapThreshold: 4,
                ...sortable,
                onEnd: (event) => onSortEnd(editor, node, event)
            });
        }
    }, [editor, node, sortable, disabled, readOnly]);

    function insertItem() {
        if (useActions === false) {
            return;
        }
        const insertOptions = editor.getArrayAddOptions(node);
        if (isJSONError(insertOptions)) {
            console.log(insertOptions);
            return;
        }
        if (insertOptions.length === 1) {
            editor.appendItem(node, insertOptions[0]);
            return;
        }
        showSelectItemModal(true);
    }

    return (
        <Accordion>
            <Accordion.Title active={toggleState}>
                <List.Content floated="right">
                    <Icon name="add" link onClick={insertItem} />
                </List.Content>
                <List.Header className="clickable">
                    <Icon name="dropdown" link onClick={() => setToggleState(!toggleState)} />
                    <span className="clickable" onClick={() => scrollTo(node)}>
                        {getNavigationTitle(node)}
                    </span>
                </List.Header>
            </Accordion.Title>
            <Accordion.Content active={toggleState}>
                <Ref innerRef={ref}>
                    <List.List className="children">
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
            </Accordion.Content>
            <InsertItemModal
                editor={editor}
                node={node}
                isOpen={isModalOpen}
                onClose={() => showSelectItemModal(false)}
            />
        </Accordion>
    );
}

function ChildNavigation({ node, editor }: { node: Node; editor: JsonEditor }) {
    if (node.type === 'array') {
        return <ArrayChildNavigation node={node} editor={editor} />;
    }
    if (node.type === 'object') {
        return (
            <>
                <List.Header className="clickable" onClick={() => scrollTo(node)}>
                    {getNavigationTitle(node)}
                </List.Header>
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
 * Navigation Editor
 *
 * Overview of current properties and array items. Mainly used as standalone
 * editor to show a navigation of the current form in a sidebar panel.
 *
 * Usage:
 *
 * ```jsx
 * <NavigationEditor
 *      node={node}
 *      editor={editor}
 *      // options={{ withChildren: true }}
 *  />
 * ```
 */
export const NavigationWidget = widget<ParentNode>(({ node, editor }) => {
    return (
        <List divided relaxed="very">
            {node.children.map((child: Node) => {
                if (child.options.hidden) {
                    return null;
                }
                return (
                    <List.Item key={child.id}>
                        <ChildNavigation node={child} editor={editor} />
                    </List.Item>
                );
            })}
        </List>
    );
});

// export const NavigationEditorPlugin: EditorPlugin = {
//     id: 'navigation-widget',
//     use: (node) => node.schema.type === 'object',
//     Editor: NavigationEditor
// };
