import { widget, WidgetPlugin, StringNode, DefaultNodeOptions, WidgetField } from '@sagold/react-json-editor';
import { ColorInput } from '@mantine/core';
import { Description } from '../components/Description';

export type ColorOptions = DefaultNodeOptions;

export const ColorWidget = widget<StringNode<ColorOptions>, string>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <ColorInput
                id={node.id}
                // emitOnChange={options.liveUpdate}
                description={<Description text={options.description} />}
                disabled={options.disabled || isValidConst}
                error={node.errors.map((e) => e.message).join('\n')}
                label={options.title}
                onChange={setValue}
                placeholder={options.placeholder}
                readOnly={options.readOnly}
                required={options.required}
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
