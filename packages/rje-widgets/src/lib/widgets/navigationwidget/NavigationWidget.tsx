import Sortable from 'sortablejs';
import { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import {
    widget,
    Editor,
    ParentNode,
    ArrayNode,
    ObjectNode,
    DefaultNodeOptions,
    Node,
    isJsonError
} from '@sagold/react-json-editor';
import { ModalContentSelectItem } from '../arraywidget/ArrayWidget';
import { Icon } from '../../components/icon/Icon';
import { Button, ButtonControlled } from '../../components/button/Button';
import { useModal, Modal } from '../../components/modal/Modal';

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

function onSortEnd(editor: Editor, node: ArrayNode, event: Sortable.SortableEvent) {
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

function ArrayChildNavigation({
    node,
    editor,
    portalContainer
}: {
    node: ArrayNode<ArrayOptions>;
    editor: Editor;
    portalContainer: RefObject<Element>;
}) {
    const ref = useRef<HTMLUListElement>(null);
    const { modalTriggerProps: insertModalTriggerProps, modalProps: insertModalProps } = useModal<HTMLButtonElement>();
    const [toggleState, setToggleState] = useState<boolean>(false);

    const { sortable = {}, disabled = false, readOnly = false } = node.options;
    useEffect(() => {
        if (ref.current && !disabled && !readOnly) {
            Sortable.create(ref.current, {
                handle: '.rje-nav-item__handle',
                swapThreshold: 4,
                ...sortable,
                onEnd: (event) => onSortEnd(editor, node, event)
            });
        }
    }, [editor, node, sortable, disabled, readOnly]);

    const _insertOptions = editor.getArrayAddOptions(node);
    let insertOptions;
    if (isJsonError(_insertOptions)) {
        insertOptions = [];
    } else {
        insertOptions = _insertOptions;
    }

    const insertItem = useCallback(() => {
        editor.appendItem(node, insertOptions[0]);
    }, [node, editor, insertOptions]);

    return (
        <div>
            <div className="rje-navigation__group rje-navigation__group--parent">
                <Button
                    className="rje-navigation__collapse"
                    variant="text"
                    icon={toggleState ? 'expand_less' : 'expand_more'}
                    onPress={() => setToggleState(!toggleState)}
                />
                <NavigationLink node={node} />
                {insertOptions.length > 1 ? (
                    <ButtonControlled {...insertModalTriggerProps} variant="text" icon="add" />
                ) : (
                    <Button variant="text" icon="add" onPress={insertItem} />
                )}
            </div>

            {toggleState && (
                <ul className="rje-navigation__children" ref={ref}>
                    {node.children.map((childchild: Node) => {
                        // @todo configurable title location for parent-nodes
                        return (
                            <li key={childchild.id + 'nav'} className="rje-navigation__group">
                                <NavigationLink node={childchild} />
                                <button className="rje-button rje-button--text">
                                    <Icon className="rje-nav-item__handle">drag_handle</Icon>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
            <Modal {...insertModalProps} portalContainer={portalContainer} isDismissable={true}>
                {(close) => <ModalContentSelectItem editor={editor} node={node} close={close} items={insertOptions} />}
            </Modal>
        </div>
    );
}

function ObjectPropertyNavigation({
    node,
    editor,
    portalContainer
}: {
    node: ObjectNode;
    editor: Editor;
    portalContainer: RefObject<Element>;
}) {
    const [toggleState, setToggleState] = useState<boolean>(false);
    return (
        <div>
            <div className="rje-navigation__group rje-navigation__group--parent">
                <Button variant="text" icon="dropdown" onPress={() => setToggleState(!toggleState)} />
                <NavigationLink node={node} />
            </div>
            {toggleState && (
                <ul className="rje-navigation__children">
                    {node.children.map((childchild: Node) => {
                        // @todo configurable title location for parent-nodes
                        return (
                            <li key={childchild.id + 'nav'}>
                                <NavigationLink node={node} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

const NavigationLink = ({ node }) => (
    <a className="rje-navigation__link" onClick={() => scrollTo(node)}>
        {getNavigationTitle(node)}
    </a>
);

function ChildNavigation({
    node,
    editor,
    options,
    portalContainer
}: {
    node: Node;
    editor: Editor;
    options: NavigationOptions;
    portalContainer: RefObject<Element>;
}) {
    if (node.type === 'array') {
        return <ArrayChildNavigation node={node} editor={editor} portalContainer={portalContainer} />;
    }
    if (node.type === 'object' && options.showProperties) {
        return <ObjectPropertyNavigation node={node} editor={editor} portalContainer={portalContainer} />;
    }
    return <NavigationLink node={node} />;
}

export type NavigationOptions = DefaultNodeOptions<{
    showProperties?: boolean;
}>;

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
export const NavigationWidget = widget<ParentNode<NavigationOptions>>(({ node, editor, options }) => {
    const portalContainer = useRef<HTMLUListElement>(null);
    return (
        <ul className="rje-navigation" ref={portalContainer}>
            {node.children.map((child: Node) => {
                if (child.options.hidden) {
                    return null;
                }
                return (
                    <li key={child.id}>
                        <ChildNavigation
                            node={child}
                            editor={editor}
                            options={options}
                            portalContainer={portalContainer}
                        />
                    </li>
                );
            })}
        </ul>
    );
});
