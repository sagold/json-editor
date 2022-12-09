import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, Card, Popup, Icon } from 'semantic-ui-react';
import { Widget } from '../../components/widget/Widget';
export function ArrayItemDefault({ editor, node, withDragHandle, disabled, size, options = {} }) {
    options.title = undefined;
    options.description = undefined;
    return (_jsxs("div", { "data-type": "array-item", className: withDragHandle ? 'with-drag-handle' : '', children: [withDragHandle && (_jsx("div", { className: "ed-drag__handle ed-drag__container", children: _jsx(Icon, { name: "bars" }) })), _jsx("div", { className: "ed-array-item__actions", children: _jsx(Popup, { trigger: _jsx(Button, { basic: true, icon: "ellipsis vertical" }), flowing: true, hoverable: true, disabled: disabled, children: _jsx(ArrayItemActions, { editor: editor, node: node, size: size }) }) }), _jsx(Widget, { editor: editor, node: node, options: options }), size - 1 > parseInt(node.property) && _jsx("div", { className: "ed-array-item__divider" })] }));
}
export function ArrayItemCard({ editor, node, withDragHandle, disabled, size, options = {} }) {
    options.title = undefined;
    options.description = undefined;
    return (_jsxs(Card, { fluid: true, "data-type": "array-item", className: withDragHandle ? 'with-drag-handle' : '', children: [_jsxs(Card.Content, { className: withDragHandle ? 'ed-drag__handle' : '', children: [_jsx(Popup, { trigger: _jsx(Button, { basic: true, floated: "right", icon: "ellipsis vertical" }), disabled: disabled, flowing: true, hoverable: true, children: _jsx(ArrayItemActions, { editor: editor, node: node, size: size }) }), _jsx(Card.Header, { children: node.options.title }), _jsx(Card.Meta, { children: node.options.description })] }, "header"), _jsx(Card.Content, { children: _jsx(Widget, { editor: editor, node: node, options: options }) }, "item")] }, node.id));
}
export function ArrayItemActions({ node, editor, size }) {
    return (_jsxs(_Fragment, { children: [_jsx(Button, { basic: true, icon: "trash alternate outline", onClick: () => editor.removeValue(node.pointer) }), _jsx(Button, { basic: true, icon: "caret up", disabled: node.property === '0', onClick: () => editor.moveItem(node.pointer, parseInt(node.property) - 1) }), _jsx(Button, { basic: true, icon: "caret down", disabled: node.property === `${size - 1}`, onClick: () => editor.moveItem(node.pointer, parseInt(node.property) + 1) })] }));
}
//# sourceMappingURL=ArrayItem.js.map