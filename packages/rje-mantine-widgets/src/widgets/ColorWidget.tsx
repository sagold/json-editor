import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { ColorInput } from '@mantine/core';
import { widgetInputProps } from '../components/widgetInputProps';

export type ColorOptions = DefaultNodeOptions;

export const ColorWidget = widget<StringNode<ColorOptions>, string>(({ node, options, setValue }) => {
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <ColorInput
                id={node.id}
                {...widgetInputProps(node, options)}
                onChange={setValue}
                value={node.value}
                withAsterisk={options.required}
            />
        </WidgetField>
    );
});

export const ColorWidgetPlugin: WidgetPlugin = {
    id: 'color-widget',
    use: (node) => node.schema.type === 'string' && node.schema.format === 'hexColor',
    Widget: ColorWidget
};
