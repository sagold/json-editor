import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dropdown, Divider } from 'semantic-ui-react';
import { getOptions } from 'headless-json-editor';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { widget } from '../decorators';
import { Widget } from '../../components/widget/Widget';
export function useSelectOneOfWidget(node, { skipSelectOneOf = false } = {}) {
    return !skipSelectOneOf && node.schema.oneOfSchema && node.schema.oneOfSchema.oneOf.length > 1;
}
export const SelectOneOfWidget = widget(({ editor, node, options }) => {
    var _a;
    const selectedSchema = node.schema;
    const onChange = (e, { value }) => {
        var _a;
        const schema = (_a = selectedSchema.oneOfSchema) === null || _a === void 0 ? void 0 : _a.oneOf[`${value}`];
        const data = editor.getTemplateData(schema);
        editor.setValue(node.pointer, data);
    };
    const selectOptions = (_a = selectedSchema.oneOfSchema) === null || _a === void 0 ? void 0 : _a.oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));
    const { oneOfSchema } = node.schema;
    return (_jsxs("div", { className: "ed-form ed-form--parent ed-oneof", children: [_jsx(ParentHeader, { node: node, options: getOptions(oneOfSchema, node.property) }), _jsx(Divider, { horizontal: true, children: _jsx(Dropdown, { compact: true, onChange: onChange, options: selectOptions, readOnly: options.readOnly === true, value: selectedSchema.oneOfIndex }) }), _jsx("div", { className: "ed-children", children: _jsx(Widget, { node: node, editor: editor, options: { title: undefined, skipSelectOneOf: true } }) })] }));
});
export const SelectOneOfWidgetPlugin = {
    id: 'select-oneof-widget',
    use: useSelectOneOfWidget,
    Widget: SelectOneOfWidget
};
//# sourceMappingURL=SelectOneOfWidget.js.map