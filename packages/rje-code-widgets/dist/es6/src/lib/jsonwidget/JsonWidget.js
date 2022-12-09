import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CodeMirror from '@uiw/react-codemirror';
import { Form, Label } from 'semantic-ui-react';
import { json as jsonSyntax, jsonLanguage } from '@codemirror/lang-json';
import { jsonSchemaLinter } from './jsonSchemaLinter';
import { linter, lintGutter } from '@codemirror/lint';
import { json } from 'headless-json-editor';
import { widget, classNames } from '@sagold/react-json-editor';
import { useState, useCallback, useMemo } from 'react';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';
import { jsonSchemaTooltip } from './jsonSchemaTooltip';
import { jsonSchemaCompletion } from './jsonSchemaCompletion';
export const JsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return _jsx(JsonStringWidget, { ...props });
    }
    return _jsx(JsonDataWidget, { ...props });
};
export const JsonDataWidget = widget(({ node, options, editor, setValue }) => {
    var _a;
    const [validJson, setJsonValid] = useState(true);
    const onChange = useCallback((value) => {
        try {
            setValue(JSON.parse(value));
            setJsonValid(true);
        }
        catch (e) {
            console.log('failed parsing value');
            setJsonValid(false);
        }
    }, [setValue]);
    const [ref] = useCodeMirrorOnBlur(onChange, node.pointer);
    const onChangeListener = {};
    if (options.liveUpdate) {
        onChangeListener['onChange'] = onChange;
    }
    else {
        onChangeListener['ref'] = ref;
    }
    const extensions = [
        jsonSyntax(),
        jsonLanguage.data.of({
            autocomplete: jsonSchemaCompletion(editor.draft, node.schema)
        }),
        lintGutter(),
        linter(jsonSchemaLinter(editor, node.schema || {})),
        jsonSchemaTooltip(editor, node.pointer)
    ];
    return (_jsxs("div", { className: classNames('ed-form ed-form--value ed-value ed-code', options.classNames), "data-type": "object", "data-id": node.pointer, children: [_jsxs(Form.Field, { id: node.id, error: !validJson, disabled: options.disabled, children: [_jsx("label", { children: options.title }), _jsx(CodeMirror, { value: JSON.stringify(json(node), null, 2), basicSetup: options.setup, editable: options.disabled === false, extensions: extensions, height: options.height, minHeight: options.minHeight, maxHeight: options.maxHeight, indentWithTab: options.indentWithTab, placeholder: options.placeholder, readOnly: options.readOnly, theme: (_a = options.theme) !== null && _a !== void 0 ? _a : 'light', ...onChangeListener, style: {
                            border: '1px solid silver'
                        } })] }), !validJson && (_jsx(Label, { color: "red", basic: true, prompt: true, pointing: "above", children: "Invalid json format. Changes will be applied only if the json is valid." })), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const JsonStringWidget = widget(({ node, options, editor, setValue }) => {
    var _a;
    const [validJson, setJsonValid] = useState(true);
    const onChange = useCallback((value) => {
        try {
            JSON.parse(value);
            setValue(value);
            setJsonValid(true);
        }
        catch (e) {
            console.log('failed parsing value');
            setJsonValid(false);
        }
    }, [setValue]);
    // tooltip cannot be recreated, because of codemirror hooking into editor
    // instance in this case and there would be conflicting instances on the
    // editor state
    const tooltip = useMemo(() => jsonSchemaTooltip(editor, node.pointer, options.schema), []);
    const extensions = [jsonSyntax(), lintGutter(), linter(jsonSchemaLinter(editor, options.schema || {}))];
    if (options.schema) {
        extensions.push(tooltip, jsonLanguage.data.of({
            autocomplete: jsonSchemaCompletion(editor.draft, options.schema)
        }));
    }
    const [ref] = useCodeMirrorOnBlur(onChange, node.pointer);
    const onChangeListener = {};
    if (options.liveUpdate) {
        onChangeListener['onChange'] = onChange;
    }
    else {
        onChangeListener['ref'] = ref;
    }
    return (_jsxs("div", { className: classNames('ed-form ed-form--value ed-value ed-code', options.classNames), "data-type": "object", "data-id": node.pointer, children: [_jsxs(Form.Field, { id: node.id, error: node.errors.length > 0 || !validJson, disabled: options.disabled, children: [_jsx("label", { children: options.title }), _jsx(CodeMirror, { value: node.value, basicSetup: options.setup, editable: options.disabled === false, extensions: extensions, height: options.height, minHeight: options.minHeight, maxHeight: options.maxHeight, indentWithTab: options.indentWithTab, placeholder: options.placeholder, readOnly: options.readOnly, theme: (_a = options.theme) !== null && _a !== void 0 ? _a : 'light', ...onChangeListener, style: {
                            border: '1px solid silver'
                        } })] }), !validJson && (_jsx(Label, { color: "red", basic: true, prompt: true, pointing: "above", children: "Invalid json format. Changes will be applied only if the json is valid." })), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const JsonWidgetPlugin = {
    id: 'json-widget',
    use: ({ schema }, options) => (options === null || options === void 0 ? void 0 : options.widget) === 'json' || schema.format === 'json',
    Widget: JsonWidget
};
//# sourceMappingURL=JsonWidget.js.map