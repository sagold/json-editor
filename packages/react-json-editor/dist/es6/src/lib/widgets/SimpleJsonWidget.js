import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { json } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import { widget } from './decorators';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';
export const SimpleJsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return _jsx(SimpleJsonStringWidget, { ...props });
    }
    return _jsx(SimpleJsonDataWidget, { ...props });
};
export const SimpleJsonStringWidget = widget(({ node, options, setValue }) => {
    let value = node.value;
    if (value) {
        try {
            value = JSON.stringify(JSON.parse(value), null, 2);
        }
        catch (e) {
            // @ts-ignore
        }
    }
    return (_jsxs("div", { className: `ed-form ed-value ${options.disabled ? 'disabled' : 'enabled'}`, "data-type": node.type, "data-id": node.pointer, children: [_jsx(Form.Field, { disabled: options.disabled === true, control: TextareaAutosize, id: node.id, rows: 1, required: options.required === true, readOnly: options.readOnly === true, minRows: 10, maxRows: 40, cacheMeasurements: true, defaultValue: value, error: node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }, label: options.title, onChange: (e) => {
                    setValue(e.target.value);
                } }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const SimpleJsonDataWidget = widget(({ node, options, setValue }) => {
    const value = json(node);
    const [error, setError] = useState(false);
    return (_jsxs("div", { className: `ed-form ed-value ${options.disabled ? 'disabled' : 'enabled'}`, "data-type": node.type, "data-id": node.pointer, children: [_jsx(Form.Field, { disabled: options.disabled === true, control: TextareaAutosize, id: node.id, rows: 1, required: options.required === true, readOnly: options.readOnly === true, minRows: 10, maxRows: 40, cacheMeasurements: true, defaultValue: JSON.stringify(value, null, 2), error: error ? { content: 'Invalid json format' } : false, label: options.title, onChange: (e) => {
                    try {
                        setValue(JSON.parse(e.target.value));
                        setError(false);
                    }
                    catch (e) {
                        setError(true);
                    }
                } }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const SimpleJsonWidgetPlugin = {
    id: 'simple-json-widget',
    use: ({ schema }, options) => (options === null || options === void 0 ? void 0 : options.widget) === 'json' || schema.format === 'json',
    Widget: SimpleJsonWidget
};
//# sourceMappingURL=SimpleJsonWidget.js.map