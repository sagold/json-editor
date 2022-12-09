import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getChildNode } from 'headless-json-editor';
import { Button, Card, Segment, Message, Icon, Grid } from 'semantic-ui-react';
import { useState } from 'react';
import { buildObjectLayout } from './buildObjectLayout';
import { widget } from '../decorators';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { classNames } from '../../classNames';
import { Widget } from '../../components/widget/Widget';
export const ObjectWidget = widget(({ node, options, editor }) => {
    var _a, _b;
    const [showContent, setShowContent] = useState(options.collapsed ? !options.collapsed : true);
    const [isEditModalOpen, openEditModal] = useState(false);
    const childOptions = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);
    let children;
    if (options.layout && Array.isArray(options.layout.cells)) {
        const cells = buildObjectLayout(node, options.layout);
        children = (_jsx("div", { className: "ed-object__items ed-object__items--grid", children: _jsx(Grid, { stackable: true, columns: "equal", children: cells.map((cell) => {
                    var _a;
                    const child = getChildNode(node, cell.prop);
                    if (child == null) {
                        return null;
                    }
                    return (_jsx(Grid.Column, { width: (_a = cell.width) !== null && _a !== void 0 ? _a : 16, style: { padding: 0 }, children: _jsx(Widget, { node: child, editor: editor, options: childOptions }, child.id) }, cell.prop));
                }) }) }));
    }
    else {
        children = (_jsx("div", { className: "ed-object__items", style: { boxShadow: 'none', border: 0 }, children: node.children.map((child) => (_jsx(Widget, { node: child, editor: editor, options: childOptions }, child.id))) }));
    }
    const { title, description, editJson = {}, layout, header } = options;
    const inverted = (_a = header === null || header === void 0 ? void 0 : header.inverted) !== null && _a !== void 0 ? _a : false;
    if ((layout === null || layout === void 0 ? void 0 : layout.type) === 'card') {
        return (_jsxs(Card, { fluid: true, "data-type": "object", "data-id": node.pointer, className: (_b = options.classNames) === null || _b === void 0 ? void 0 : _b.join(' '), children: [_jsxs(Card.Content, { style: { background: header === null || header === void 0 ? void 0 : header.color }, children: [editJson.enabled && (_jsx(Button, { basic: true, floated: "right", icon: "edit outline", onClick: () => openEditModal(true) })), _jsx(Card.Header, { children: title }), _jsx(Card.Meta, { children: description })] }, "header"), _jsxs(Card.Content, { children: [node.errors.length > 0 && (_jsx(Segment, { basic: true, children: _jsx(Message, { error: true, children: node.errors.map((e) => (_jsx(Message.Item, { children: e.message }, e.message))) }) })), children, editJson.enabled && (_jsx(WidgetModal, { editor: editor, node: node, options: { ...options, widget: 'json' }, isOpen: isEditModalOpen, closeModal: () => openEditModal(false) }))] }, "content")] }));
    }
    return (_jsxs("div", { className: classNames('ed-form ed-form--parent ed-object', options.classNames), "data-type": "object", "data-id": node.pointer, children: [(editJson.enabled || title || description || options.collapsed != null) && (_jsx(ParentHeader, { node: node, options: options, icon: options.collapsed != null && (_jsx(Icon, { link: true, rotated: !showContent ? 'counterclockwise' : undefined, name: "dropdown", onClick: () => setShowContent(!showContent) })), children: editJson.enabled && (_jsx(Button, { basic: true, inverted: inverted, icon: "edit outline", onClick: () => openEditModal(true) })) })), node.errors.length > 0 && (_jsx(Segment, { basic: true, children: _jsx(Message, { error: true, children: node.errors.map((e) => (_jsx(Message.Item, { children: e.message }, e.message))) }) })), showContent && children, editJson.enabled && (_jsx(WidgetModal, { editor: editor, node: node, options: { modalSize: editJson.modalSize, ...options, widget: 'json' }, isOpen: isEditModalOpen, closeModal: () => openEditModal(false) }))] }));
});
export const ObjectWidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
//# sourceMappingURL=ObjectWidget.js.map