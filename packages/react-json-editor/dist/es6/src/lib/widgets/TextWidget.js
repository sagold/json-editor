import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Label } from 'semantic-ui-react';
import { widget } from './decorators';
import TextareaAutosize from 'react-textarea-autosize';
export const TextWidget = widget(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;
    const onChange = (e) => setValue(e.target.value || '');
    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };
    return (_jsxs("div", { className: `ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`, "data-type": "string", "data-id": node.pointer, children: [_jsxs(Form.Field, { disabled: options.disabled, required: options.required === true, error: node.errors.length > 0, children: [_jsx("label", { htmlFor: node.id, children: options.title }), _jsx(TextareaAutosize, { disabled: options.disabled, id: node.id, rows: 1, required: options.required === true, readOnly: options.readOnly === true, minRows: 2, maxRows: 10, cacheMeasurements: true, defaultValue: node.value, ...changeListener }), node.errors.length > 0 && (_jsx(Label, { color: "red", basic: true, prompt: true, pointing: "above", children: node.errors.map((e) => e.message).join(';') }))] }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const TextWidgetPlugin = {
    id: 'text-widget',
    use: (node) => node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Widget: TextWidget
};
//# sourceMappingURL=TextWidget.js.map