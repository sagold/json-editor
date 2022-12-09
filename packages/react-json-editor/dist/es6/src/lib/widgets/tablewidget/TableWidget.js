import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { get } from 'headless-json-editor';
import { Table } from 'semantic-ui-react';
import { widget } from '../decorators';
import { useState } from 'react';
import { WidgetModal } from '../../components/widgetmodal/WidgetModal';
import { getTypeOf } from 'json-schema-library';
/**
 * @todo maybe better to use ag-grid
 */
export const TableWidget = widget(({ node, editor, options }) => {
    var _a;
    // @ts-ignore
    const columns = Object.keys(((_a = node.schema.items) === null || _a === void 0 ? void 0 : _a.properties) || {});
    const [edit, setEdit] = useState({ isOpen: false });
    return (_jsxs("div", { className: "ed-form ed-parent", "data-type": "array", children: [_jsxs(Table, { celled: true, definition: true, children: [_jsx(Table.Header, { children: _jsx(Table.Row, { children: columns.map((title, index) => (_jsx(Table.HeaderCell, { children: title }, index))) }) }), _jsx(Table.Body, { children: node.children.map((row) => {
                            // @ts-ignore
                            const children = row === null || row === void 0 ? void 0 : row.children;
                            if (!Array.isArray(children)) {
                                return null;
                            }
                            return (_jsx(Table.Row, { children: children.map((cell) => {
                                    return (_jsx(Table.Cell, { selectable: true, error: cell.errors.length > 0, children: _jsx("a", { className: "clickable", onClick: () => setEdit({ isOpen: true, pointer: row.pointer, cell }), children: cell.value }) }, cell.id));
                                }) }, row.id));
                        }) })] }), edit.pointer && (_jsx(WidgetModal, { editor: editor, node: get(node, edit.pointer), isOpen: edit.isOpen, options: options, closeModal: () => setEdit({ isOpen: false }) }))] }));
});
export const TableWidgetPlugin = {
    id: 'array-widget',
    use: (node) => node.schema.type === 'array' && getTypeOf(node.schema.items) === 'object',
    Widget: TableWidget
};
//# sourceMappingURL=TableWidget.js.map