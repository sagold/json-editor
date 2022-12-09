import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const NullWidget = ({ node }) => {
    const { description, title, pointer } = node.options;
    return (_jsxs("div", { className: "ed-form ed-value", "data-type": "null", "data-id": pointer, children: [_jsx("div", { className: "field", children: _jsx("label", { children: title }) }), description && _jsx("em", { className: "ed-description", children: description })] }));
};
export const NullWidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
//# sourceMappingURL=NullWidget.js.map