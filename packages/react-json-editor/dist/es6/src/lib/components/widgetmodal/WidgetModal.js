import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Modal, Form } from 'semantic-ui-react';
import { isJSONError } from 'json-schema-library';
export function WidgetModal({ isOpen, closeModal, editor, node, options }) {
    var _a;
    if (isJSONError(node)) {
        console.log(node);
        return null;
    }
    const Widget = editor.getWidget(node, options);
    return (_jsxs(Modal, { open: isOpen, onClose: closeModal, size: options.modalSize, children: [_jsx(Modal.Header, { children: (_a = options === null || options === void 0 ? void 0 : options.title) !== null && _a !== void 0 ? _a : node.options.title }), _jsx(Modal.Content, { children: _jsx(Form, { error: true, style: { maxWidth: 'none' }, children: _jsx(Widget, { node: node, editor: editor, options: { ...options, title: undefined } }) }) }), _jsx(Modal.Actions, { children: _jsx(Button, { basic: true, onClick: closeModal, children: "close" }) })] }));
}
//# sourceMappingURL=WidgetModal.js.map