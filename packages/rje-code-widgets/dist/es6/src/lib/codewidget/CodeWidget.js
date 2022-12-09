import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CodeMirror from '@uiw/react-codemirror';
import { Form } from 'semantic-ui-react';
import { widget, classNames } from '@sagold/react-json-editor';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';
export function createCodeWidgetPlugin({ extensions, format }) {
    if (typeof format !== 'string') {
        throw new Error(`Format is required to create a code widget. Given: '${format}'`);
    }
    return {
        id: `${format}-code-widget`,
        use: (node) => node.schema.type === 'string' && node.schema.format === format,
        Widget: widget(({ node, options, editor, setValue }) => {
            var _a;
            const [ref] = useCodeMirrorOnBlur(setValue, node.pointer);
            const onChangeListener = {};
            if (options.liveUpdate) {
                onChangeListener['onChange'] = setValue;
            }
            else {
                onChangeListener['ref'] = ref;
            }
            return (_jsxs("div", { className: classNames('ed-form ed-form--value ed-value ed-code', options.classNames), "data-type": "object", "data-id": node.pointer, children: [_jsxs(Form.Field, { id: node.id, error: node.errors.length > 0, disabled: options.disabled, children: [_jsx("label", { children: options.title }), _jsx(CodeMirror, { value: node.value, basicSetup: options.setup, editable: options.disabled === false, extensions: extensions, height: options.height, minHeight: options.minHeight, maxHeight: options.maxHeight, indentWithTab: options.indentWithTab, placeholder: options.placeholder, readOnly: options.readOnly, theme: (_a = options.theme) !== null && _a !== void 0 ? _a : 'light', ...onChangeListener })] }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
        })
    };
}
//# sourceMappingURL=CodeWidget.js.map