import {
    BooleanNode,
    DefaultNodeOptions,
    WidgetPlugin,
    widget,
    DecoratedWidgetProps,
    WidgetProps
} from '@sagold/react-json-editor';
import { Switch } from '../../components/switch/Switch';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Checkbox } from '../../components/checkbox/Checkbox';

export type BooleanOptions = DefaultNodeOptions<{
    type?: 'checkbox' | 'toggle';
}>;

export const booleanDefaultOptions = {
    type: 'toggle'
};

export const BooleanWidget = function (props: WidgetProps) {
    const type = (props.node.options?.type || props?.options?.type) ?? booleanDefaultOptions.type;
    if (props.node.schema.format === 'checkbox' || type === 'checkbox') {
        return <CheckboxWidget {...(props as DecoratedWidgetProps<BooleanNode, boolean>)} />;
    }
    return <ToggleWidget {...(props as DecoratedWidgetProps<BooleanNode, boolean>)} />;
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
