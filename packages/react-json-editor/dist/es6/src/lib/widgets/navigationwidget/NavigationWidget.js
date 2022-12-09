import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Ref from '@semantic-ui-react/component-ref';
import Sortable from 'sortablejs';
import { widget } from '../decorators';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { List, Accordion, Icon } from 'semantic-ui-react';
import { isJSONError } from 'headless-json-editor';
import { useState, useRef, useEffect } from 'react';
function scrollTo(node) {
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
function getNavigationTitle(node) {
    var _a;
    return (_a = node.options.title) !== null && _a !== void 0 ? _a : node.property;
}
function onSortEnd(editor, node, event) {
    var _a;
    const targetIndex = parseInt(`${event.newIndex}`);
    if (isNaN(targetIndex)) {
        return;
    }
    const { /*to,*/ from, oldIndex, /*newIndex,*/ item } = event;
    // always remove node - we create it from data
    (_a = item === null || item === void 0 ? void 0 : item.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item);
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
function ArrayChildNavigation({ node, editor }) {
    const ref = useRef();
    const [isModalOpen, showSelectItemModal] = useState(false);
    const [toggleState, setToggleState] = useState(false);
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
    return (_jsxs(Accordion, { children: [_jsxs(Accordion.Title, { active: toggleState, children: [_jsx(List.Content, { floated: "right", children: _jsx(Icon, { name: "add", link: true, onClick: insertItem }) }), _jsxs(List.Header, { className: "clickable", children: [_jsx(Icon, { name: "dropdown", link: true, onClick: () => setToggleState(!toggleState) }), _jsx("span", { className: "clickable", onClick: () => scrollTo(node), children: getNavigationTitle(node) })] })] }), _jsx(Accordion.Content, { active: toggleState, children: _jsx(Ref, { innerRef: ref, children: _jsx(List.List, { className: "children", children: node.children.map((childchild) => {
                            // @todo configurable title location for parent-nodes
                            return (_jsxs(List.Item, { style: { display: 'flex' }, children: [_jsx(List.Content, { onClick: () => scrollTo(childchild), style: { flexGrow: 1 }, className: "clickable", children: getNavigationTitle(childchild) }), _jsx(List.Content, { floated: "right", className: "ed-nav-item__handle", children: _jsx(Icon, { link: true, name: "bars" }) })] }, childchild.id + 'nav'));
                        }) }) }) }), _jsx(InsertItemModal, { editor: editor, node: node, isOpen: isModalOpen, onClose: () => showSelectItemModal(false) })] }));
}
function ObjectPropertyNavigation({ node, editor }) {
    const [toggleState, setToggleState] = useState(false);
    return (_jsxs(Accordion, { children: [_jsx(Accordion.Title, { active: toggleState, children: _jsxs(List.Header, { className: "clickable", children: [_jsx(Icon, { name: "dropdown", link: true, onClick: () => setToggleState(!toggleState) }), _jsx("span", { className: "clickable", onClick: () => scrollTo(node), children: getNavigationTitle(node) })] }) }), _jsx(Accordion.Content, { active: toggleState, children: _jsx(Ref, { children: _jsx(List.List, { className: "children", children: node.children.map((childchild) => {
                            // @todo configurable title location for parent-nodes
                            return (_jsx(List.Item, { style: { display: 'flex' }, children: _jsx(List.Content, { onClick: () => scrollTo(childchild), style: { flexGrow: 1 }, className: "clickable", children: getNavigationTitle(childchild) }) }, childchild.id + 'nav'));
                        }) }) }) })] }));
}
function ChildNavigation({ node, editor, options }) {
    if (node.type === 'array') {
        return _jsx(ArrayChildNavigation, { node: node, editor: editor });
    }
    if (node.type === 'object') {
        if (options.showProperties) {
            return _jsx(ObjectPropertyNavigation, { node: node, editor: editor });
        }
        return (_jsx(List.Header, { className: "clickable", onClick: () => scrollTo(node), children: getNavigationTitle(node) }));
    }
    return (_jsx(List.Header, { className: "clickable", onClick: () => scrollTo(node), children: getNavigationTitle(node) }));
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
export const NavigationWidget = widget(({ node, editor, options }) => {
    return (_jsx(List, { divided: true, relaxed: "very", children: node.children.map((child) => {
            if (child.options.hidden) {
                return null;
            }
            return (_jsx(List.Item, { children: _jsx(ChildNavigation, { node: child, editor: editor, options: options }) }, child.id));
        }) }));
});
//# sourceMappingURL=NavigationWidget.js.map