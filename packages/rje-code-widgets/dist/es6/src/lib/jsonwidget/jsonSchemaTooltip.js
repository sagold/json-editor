import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Markdown from 'markdown-to-jsx';
import { createRoot } from 'react-dom/client';
import { getJsonPointerFromPosition } from './getJsonPointerFromPosition';
import { hoverTooltip } from '@codemirror/view';
const dom = document.createElement('div');
const root = createRoot(dom);
function getData(doc) {
    try {
        return JSON.parse(doc.toString());
    }
    catch (e) {
        return undefined;
    }
}
export const jsonSchemaTooltip = (editor, nodePointer = '#', localSchema) => hoverTooltip(async (view, pos, side) => {
    const { pointer, cursor, location } = getJsonPointerFromPosition(view.state, pos);
    const absolutePointer = localSchema ? `#${pointer}` : `${nodePointer}${pointer}`;
    const data = getData(view.state.doc);
    const schema = editor.draft.getSchema(`${absolutePointer}`, data, localSchema);
    if (schema.type === 'error' || location === 'value') {
        return null;
    }
    if (schema.title == null && schema.description == null) {
        return null;
    }
    return {
        // https://codemirror.net/docs/ref/#view.hoverTooltip
        pos: cursor.from,
        end: cursor.to,
        above: true,
        create(view) {
            root.render(_jsxs("div", { className: "rje-tooltip rje-tooltip--jsonschema", children: [schema.title && _jsx("h1", { children: schema.title }), schema.description && _jsx(Markdown, { children: schema.description })] }));
            return { dom };
        }
    };
});
//# sourceMappingURL=jsonSchemaTooltip.js.map