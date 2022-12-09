import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { json } from 'headless-json-editor';
import { Form, Dropdown, Message } from 'semantic-ui-react';
import { widget } from './decorators';
// @todo is building enum options job of syntax-tree?
// options format might is dependent on ui implementation
function getEnumOptions({ schema, options }) {
    var _a;
    return (_a = schema === null || schema === void 0 ? void 0 : schema.items) === null || _a === void 0 ? void 0 : _a.enum.map((value, index) => {
        var _a, _b;
        return ({
            key: value,
            value,
            text: (_b = (_a = options.enum) === null || _a === void 0 ? void 0 : _a[index]) !== null && _b !== void 0 ? _b : value
        });
    });
}
function isArraySchema(schema) {
    return schema.type === 'array';
}
function hasEnumOptions(itemsSchema) {
    return Array.isArray(itemsSchema === null || itemsSchema === void 0 ? void 0 : itemsSchema.enum);
}
export const MultiSelectWidget = widget(({ node, options, setValue }) => {
    const listData = json(node);
    // two modes: free strings or fixed enum
    let allowAdditions = true;
    let dropdownOptions;
    if (hasEnumOptions(node.schema.items)) {
        dropdownOptions = getEnumOptions(node);
        allowAdditions = false;
    }
    else {
        dropdownOptions = listData.map((value) => ({ value, text: value }));
    }
    return (_jsxs("div", { className: `ed-form ed-value ${options.disabled ? 'disabled' : 'enabled'}`, "data-type": "string", "data-id": node.pointer, children: [_jsxs(Form.Field, { required: options.required === true, id: node.id, error: node.errors.length > 0, disabled: options.disabled, children: [_jsx("label", { children: options.title }), _jsx(Dropdown, { allowAdditions: allowAdditions, multiple: true, onChange: (e, { value }) => setValue(value), options: dropdownOptions, readOnly: options.readOnly === true, search: true, selection: true, value: listData })] }), node.errors.length > 0 && (_jsx(Message, { error: true, children: node.errors.map((e) => (_jsx(Message.Item, { children: e.message }, e.message))) })), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export function useMultiSelectWidget(node) {
    return isArraySchema(node.schema) && node.schema.items.type === 'string';
}
export const MultiSelectWidgetPlugin = {
    id: 'multi-select-widget',
    use: useMultiSelectWidget,
    Widget: MultiSelectWidget
};
//# sourceMappingURL=MultiSelectWidget.js.map