import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { json } from 'headless-json-editor';
export const UnknownWidget = ({ node }) => (_jsxs("div", { "data-type": "unknown", "data-id": node.pointer, style: { background: 'rgb(208, 120, 132)', padding: '8px' }, children: [_jsxs("b", { children: ["unknown widget for node '", node.schema.type, "'"] }), _jsx("input", { value: JSON.stringify(json(node)) }), _jsx("p", { children: JSON.stringify({ ...node }, null, 2) })] }));
export const UnknownWidgetPlugin = {
    id: 'unknown-widget',
    use: () => true,
    Widget: UnknownWidget
};
//# sourceMappingURL=UnknownWidget.js.map