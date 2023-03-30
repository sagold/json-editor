import { BooleanNode, DefaultNodeOptions, WidgetPlugin, widget } from '@sagold/react-json-editor';
import { useToggleState } from 'react-stately';
import { AriaSwitchProps, useFocusRing, useSwitch, useCheckbox, VisuallyHidden } from 'react-aria';
import { useRef } from 'react';
import { Label } from '../../components/label/Label';
import { Switch } from '../../components/switch/Switch';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Checkbox } from '../../components/checkbox/Checkbox';
import theme from '../../theme';

export type BooleanOptions = {
    type?: 'checkbox' | 'toggle';
} & DefaultNodeOptions;

export const booleanDefaultOptions = {
    type: 'toggle'
};

export const BooleanWidget = function (props) {
    const type = (props.node.options?.type || props.options.type) ?? booleanDefaultOptions.type;
    if (type === 'checkbox') {
        return <CheckboxWidget {...props} />;
    }
    return <ToggleWidget {...props} />;
};

export const CheckboxWidget = widget<BooleanNode, boolean>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    const ariaLabel = options.title ?? node.pointer;
    return (
        <WidgetField widgetType="checkbox" node={node} options={options}>
            <Checkbox
                aria-label={ariaLabel}
                onChange={setValue}
                disabled={options.disabled}
                required={options.required}
                error={isValidConst}
                isSelected={node.value}
            >
                {options.title}
            </Checkbox>
        </WidgetField>
    );
});

export const ToggleWidget = widget<BooleanNode, boolean>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    const ariaLabel = options.title ?? node.pointer;
    return (
        <WidgetField widgetType="toggle" node={node} options={options}>
            <Switch
                aria-label={ariaLabel}
                onChange={setValue}
                disabled={options.disabled}
                required={options.required}
                error={isValidConst}
                isSelected={node.value}
            >
                {options.title}
            </Switch>
        </WidgetField>
    );
});

export const BooleanWidgetPlugin: WidgetPlugin = {
    id: 'boolean-widget',
    use: (node) => node.schema.type === 'boolean',
    Widget: BooleanWidget
};
