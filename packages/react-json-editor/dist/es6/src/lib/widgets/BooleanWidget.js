import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Checkbox } from 'semantic-ui-react';
import { widget } from './decorators';
export const booleanDefaultOptions = {
    type: 'toggle'
};
export const BooleanWidget = widget(({ node, options, setValue }) => (_jsxs("div", { className: "ed-form ed-value", "data-type": "boolean", "data-id": node.pointer, children: [_jsx(Form.Field, { id: node.id, error: node.errors.length > 0 && node.errors.map((e) => e.message), children: _jsx(Checkbox, { checked: node.value, label: options.title, onChange: (e, { checked }) => setValue(checked === true), readOnly: options.readOnly === true, toggle: options.type ? options.type === 'toggle' : booleanDefaultOptions.type === 'toggle' }) }), options.description && _jsx("em", { className: "ed-description", children: options.description })] })));
export const BooleanWidgetPlugin = {
    id: 'boolean-widget',
    use: (node) => node.schema.type === 'boolean',
    Widget: BooleanWidget
};
//# sourceMappingURL=BooleanWidget.js.map