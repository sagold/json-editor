import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sortable from 'sortablejs';
import { Button, Icon, Message } from 'semantic-ui-react';
import { widget } from '../decorators';
import { useState, useRef, useEffect } from 'react';
import { InsertItemModal } from '../../components/insertitemmodal/InsertItemModal';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { ArrayItemCard, ArrayItemDefault } from './ArrayItem';
import { classNames } from '../../classNames';
import Ref from '@semantic-ui-react/component-ref';
function createOnSortEnd(editor, node) {
    return function onSortEnd(event) {
        var _a;
        const targetIndex = parseInt(`${event.newIndex}`);
        if (isNaN(targetIndex)) {
            return;
        }
        const { to, from, oldIndex, newIndex, item } = event;
        // always remove node - we create it from data
        (_a = item === null || item === void 0 ? void 0 : item.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(item);
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
export const ArrayWidget = widget(({ editor, node, options }) => {
    var _a, _b, _c, _d, _e;
    const [showContent, setShowContent] = useState(options.collapsed != null ? !options.collapsed : true);
    const [openModal, setModalOpen] = useState(false);
    const [isEditModalOpen, openEditModal] = useState(false);
    let sortable = options.sortable;
    if (sortable == null) {
        sortable = { enabled: false };
    }
    sortable.enabled = (_a = sortable.enabled) !== null && _a !== void 0 ? _a : false;
    sortable.group = (_b = sortable.group) !== null && _b !== void 0 ? _b : node.pointer;
    const childOptions = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);
    function insertItem() {
        const options = editor.getArrayAddOptions(node);
        if (options.length === 1) {
            editor.appendItem(node, options[0]);
        }
        else {
            setModalOpen(true);
        }
        setShowContent(true);
    }
    const ref = useRef();
    useEffect(() => {
        if ((sortable === null || sortable === void 0 ? void 0 : sortable.enabled) && ref.current && !options.disabled && !options.readOnly) {
            Sortable.create(ref.current, {
                handle: '.ed-drag__handle',
                swapThreshold: 4,
                // delay: 250,
                ...sortable,
                onEnd: createOnSortEnd(editor, node)
            });
        }
    }, [sortable, editor]);
    const { title, description, collapsed, editJson = {} } = options;
    return (_jsxs("div", { className: classNames('ed-form ed-form--parent ed-array', options.classNames), "data-type": "array", "data-id": node.pointer, children: [(title || description || editJson.enabled || collapsed != null) && (_jsxs(ParentHeader, { node: node, options: options, icon: options.collapsed != null && (_jsx(Icon, { link: true, rotated: !showContent ? 'counterclockwise' : undefined, name: "dropdown", onClick: () => setShowContent(!showContent) })), children: [_jsx(Button, { basic: true, icon: "add", onClick: insertItem }), editJson.enabled && _jsx(Button, { basic: true, icon: "edit outline", onClick: () => openEditModal(true) })] })), node.errors.length > 0 && (_jsx(Message, { error: true, children: _jsx(Message.List, { children: node.errors.map((e) => (_jsx(Message.Item, { children: e.message }, e.message))) }) })), _jsx(Ref, { innerRef: ref, children: _jsx("div", { className: `ed-array__items ed-array__items--${(_d = (_c = options.layout) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : 'default'}`, children: showContent &&
                        (((_e = options.layout) === null || _e === void 0 ? void 0 : _e.type) === 'cards'
                            ? node.children.map((child) => (_jsx(ArrayItemCard, { disabled: options.disabled || options.readOnly, editor: editor, node: child, size: node.children.length, withDragHandle: sortable === null || sortable === void 0 ? void 0 : sortable.enabled, options: childOptions }, child.id)))
                            : node.children.map((child) => (_jsx(ArrayItemDefault, { disabled: options.disabled || options.readOnly, editor: editor, node: child, size: node.children.length, withDragHandle: sortable === null || sortable === void 0 ? void 0 : sortable.enabled, options: childOptions }, child.id)))) }) }), _jsx(InsertItemModal, { editor: editor, node: node, isOpen: openModal, onClose: () => setModalOpen(false) }), editJson.enabled && (_jsx(WidgetModal, { editor: editor, node: node, options: { modalSize: editJson.modalSize, ...options, widget: 'json' }, isOpen: isEditModalOpen, closeModal: () => openEditModal(false) }))] }));
});
export const ArrayWidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array',
    Widget: ArrayWidget
};
//# sourceMappingURL=ArrayWidget.js.map