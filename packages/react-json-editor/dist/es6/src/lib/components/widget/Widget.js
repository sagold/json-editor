import { jsx as _jsx } from "react/jsx-runtime";
export function Widget({ editor, node, options }) {
    const ChildEditor = editor.getWidget(node, options);
    return _jsx(ChildEditor, { editor: editor, node: node, options: options });
}
//# sourceMappingURL=Widget.js.map