import { Switch } from '@mantine/core';
import { BooleanNode, WidgetField, WidgetPlugin, widget } from '@sagold/react-json-editor';

export const BooleanWidget = widget<BooleanNode, boolean>(({ node, options, setValue }) => {
    const errors = node.schema.const == null ? node.errors.map((e) => e.message).join('\n') : undefined;
    return (
        <WidgetField widgetType="toggle" node={node} options={options} showDescription={false} showError={false}>
            <Switch
                label={options.title}
                required={options.required}
                description={options.description}
                error={errors}
                disabled={options.disabled}
                checked={node.value}
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
