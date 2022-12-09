import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import Ref from '@semantic-ui-react/component-ref';
// import Sortable from 'sortablejs';
import { widget } from '../decorators';
import { get as getPointer } from 'gson-pointer';
import { Button } from 'semantic-ui-react';
import { isParentNode, json, get } from 'headless-json-editor';
import { useState } from 'react';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
function getPreviewText(node) {
    if (typeof node.options.previewValue !== 'string') {
        return '';
    }
    if (node.options.previewValue === '.') {
        return json(node);
    }
    const previewText = getPointer(json(node), node.options.previewValue);
    return `${previewText}`;
}
/**
 * Master-Detail Editor for object or array values
 */
export const MasterDetailWidget = widget(({ editor, node, options }) => {
    var _a;
    const [editModal, setEditModal] = useState({ open: false });
    const { title } = options;
    return (_jsxs("div", { className: `ed-form ${isParentNode(node) ? 'ed-parent' : 'ed-value'}`, "data-type": node.schema.type, "data-id": node.pointer, children: [_jsx(ParentHeader, { node: node, options: options, children: _jsx(Button, { basic: true, inverted: ((_a = options.header) === null || _a === void 0 ? void 0 : _a.inverted) === true, icon: "edit outline", className: "clickable", onClick: () => {
                        setEditModal({ open: true, pointer: node.pointer });
                    } }) }), node.type === 'array' && (_jsxs("div", { style: { flexGrow: 1 }, children: [_jsx("span", { children: title }), _jsx("span", { children: getPreviewText(node) })] })), editModal.open && editModal.pointer && (_jsx(WidgetModal, { editor: editor, node: get(editor.state, editModal.pointer), options: { ...options, skipMaster: true }, isOpen: editModal.open, closeModal: () => setEditModal({ open: false }) }))] }));
});
export const MasterDetailWidgetPlugin = {
    id: 'master-detail-widget',
    use: (node, options = {}) => options.skipMaster !== true &&
        (node.schema.type === 'object' || node.schema.type === 'array') &&
        options.widget === 'MasterDetail',
    Widget: MasterDetailWidget
};
//# sourceMappingURL=MasterDetailWidget.js.map