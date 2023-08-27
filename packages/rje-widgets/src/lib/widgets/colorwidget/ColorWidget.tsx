import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { ColorInput, ColorInputProps } from '../../components/colorinput/ColorInput';
import { WidgetField } from '../../components/widgetfield/WidgetField';

export type ColorOptions = {} & DefaultNodeOptions;

export const ColorWidget = widget<StringNode<ColorOptions>, string>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    return (
        <WidgetField widgetType="color" node={node} options={options}>
            <ColorInput
                id={node.id}
                title={options.title}
                value={node.value}
                error={hasError}
                readOnly={options.readOnly}
                required={options.required}
                placeholder={options.placeholder}
                onChange={setValue}
                disabled={options.disabled || isValidConst}
            />
        </WidgetField>
    );
});

export const ColorWidgetPlugin: WidgetPlugin = {
    id: 'color-widget',
    use: (node) => node.schema.type === 'string' && node.schema.format === 'hexColor',
    Widget: ColorWidget
};
