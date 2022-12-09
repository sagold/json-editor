import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Dropdown, Label, Input } from 'semantic-ui-react';
import { widget } from './decorators';
export const StringWidget = widget(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;
    const onChange = (e) => setValue(e.target.value);
    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };
    return (_jsxs("div", { className: `ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`, "data-type": "string", "data-id": node.pointer, children: [_jsxs(Form.Field, { id: node.id, inline: options.inline === true, disabled: disabled, required: options.required === true, error: node.errors.length > 0, children: [_jsx("label", { htmlFor: node.id, children: options.title }), _jsx(Input, { id: node.id, type: "text", disabled: disabled, placeholder: options.placeholder, readOnly: options.readOnly === true, icon: options.icon, iconPosition: options.iconPosition, defaultValue: node.value, ...changeListener }), node.errors.length > 0 && (_jsx(Label, { color: "red", basic: true, prompt: true, pointing: "above", children: node.errors.map((e) => e.message).join(';') }))] }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const StringWidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'string',
    Widget: StringWidget
};
export const SelectWidget = widget(({ node, options, setValue }) => {
    var _a, _b;
    const enumValues = (node.schema.enum || []);
    const titles = (_a = options.enum) !== null && _a !== void 0 ? _a : [];
    const selectOptions = enumValues.map((value, index) => {
        var _a;
        return ({
            key: index,
            value,
            text: (_a = titles[index]) !== null && _a !== void 0 ? _a : value
        });
    });
    return (_jsxs("div", { className: "ed-form ed-value", "data-type": "string", children: [_jsxs(Form.Field, { required: options.required === true, id: node.pointer, error: node.errors.length > 0 && node.errors.map((e) => e.message), children: [_jsx("label", { children: (_b = options.title) !== null && _b !== void 0 ? _b : node.property }), _jsx(Dropdown, { selection: true, onChange: (event, { value }) => setValue(value), value: node.value, options: selectOptions })] }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
//# sourceMappingURL=StringWidget.js.map