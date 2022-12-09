import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Modal, Dropdown } from 'semantic-ui-react';
import { useState } from 'react';
export function InsertItemModal({ editor, node, isOpen, onClose }) {
    const options = editor.getArrayAddOptions(node);
    const [modal, setModal] = useState({
        selected: 0
    });
    const handleSelection = (event, { value }) => setModal({ ...modal, selected: parseInt(`${value}`) });
    function addSelectedItem() {
        editor.appendItem(node, options[modal.selected]);
        onClose();
    }
    return (_jsxs(Modal, { open: isOpen, onClose: onClose, children: [_jsx(Modal.Header, { children: "Select new array item" }), _jsx(Modal.Content, { children: _jsx(Dropdown, { onChange: handleSelection, defaultValue: modal.selected, options: options.map((o, index) => ({
                        key: o.id,
                        value: index,
                        text: o.title
                    })) }) }), _jsxs(Modal.Actions, { children: [_jsx(Button, { basic: true, onClick: onClose, children: "cancel" }), _jsx(Button, { color: "black", onClick: addSelectedItem, children: "create" })] })] }));
}
//# sourceMappingURL=InsertItemModal.js.map