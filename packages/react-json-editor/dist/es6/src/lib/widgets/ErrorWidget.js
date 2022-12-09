import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { json, isJSONError } from 'headless-json-editor';
import { Form, Button, Icon } from 'semantic-ui-react';
export const ErrorWidget = ({ node, editor }) => {
    const value = JSON.stringify(json(node));
    const error = node.schema;
    const description = `${error.name} '${node.pointer}': ${error.message}`;
    return (_jsxs("div", { className: "ed-form", "data-type": "error", "data-id": node.pointer, children: [_jsx(Form.Input, { id: node.id, type: "text", readOnly: true, value: value, error: node.errors.length > 0 && node.errors.map((e) => e.message), label: `${node.property} (${error.name})` }), _jsx(Button, { basic: true, icon: true, onClick: () => editor.removeValue(node.pointer), children: _jsx(Icon, { name: "trash alternate outline" }) }), description && _jsx("em", { className: "ed-description", children: description }), _jsx("p", { style: { background: 'rgb(208, 120, 132)', padding: '8px' }, children: JSON.stringify({ ...node.schema }, null, 2) })] }));
};
export const ErrorWidgetPlugin = {
    id: 'error-widget',
    use: (node) => isJSONError(node.schema),
    Widget: ErrorWidget
};
//# sourceMappingURL=ErrorWidget.js.map