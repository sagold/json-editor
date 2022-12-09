import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form, Input /*, SemanticShorthandItem, LabelProps*/ } from 'semantic-ui-react';
import { widget } from './decorators';
import { useCallback } from 'react';
export const NumberWidget = widget(({ node, options, setValue }) => {
    const onChange = useCallback((event) => {
        const input = event.target;
        const number = parseFloat(input.value);
        if (`${number}` === input.value) {
            setValue(number);
        }
        else {
            // @todo TYPE CHANGE BREAKS EVERYTHING
            // should not change node type - should maintain expected type from schema
            // @ts-ignore
            setValue(input.value);
        }
    }, [setValue]);
    const changeListener = {
        [options.liveUpdate ? 'onChange' : 'onBlur']: onChange
    };
    return (_jsxs("div", { className: "ed-form ed-value", "data-type": "number", "data-id": node.pointer, children: [_jsx(Form.Input, { disabled: options.disabled === true, error: node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }, id: node.id, inline: options.inline === true, label: options.title, required: options.required === true, children: _jsx(Input, { defaultValue: node.value, disabled: options.disabled === true, icon: options.icon, iconPosition: options.iconPosition, id: node.id, placeholder: options.placeholder, readOnly: options.readOnly === true, required: options.required === true, type: "number", ...changeListener }) }), options.description && _jsx("em", { className: "ed-description", children: options.description })] }));
});
export const NumberWidgetPlugin = {
    id: 'number-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
//# sourceMappingURL=NumberWidget.js.map