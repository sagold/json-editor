import { Checkbox, Switch } from '@mantine/core';
import { BooleanNode, WidgetField, WidgetPlugin, widget } from '@sagold/react-json-editor';
import { widgetInputProps } from '../../components/widgetInputProps';

export const BooleanWidget = widget<BooleanNode, boolean>(({ node, options, setValue }) => {
    const Input = node.schema.format === 'switch' ? Switch : Checkbox;
    return (
        <WidgetField widgetType="toggle" node={node} options={options} showDescription={false} showError={false}>
            <Input
                {...widgetInputProps(node, options)}
                // @ts-expect-error
                withAsterisk={undefined}
                checked={node.value ?? false}
                onChange={(e) => setValue(e.currentTarget.checked)}
            />
        </WidgetField>
    );
});

export const BooleanWidgetPlugin: WidgetPlugin = {
    id: 'boolean-widget',
    use: (node) => node.schema.type === 'boolean',
    Widget: BooleanWidget
};
