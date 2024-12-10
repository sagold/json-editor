import { Code, InputWrapper } from '@mantine/core';
import { WidgetField, WidgetPlugin, widget } from '@sagold/react-json-editor';
import { widgetInputProps } from '../components/widgetInputProps';

export const UnknownWidget = widget(({ node, options }) => (
    <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
        <div className="rje-field rje-field--unknown rje-field--error" data-type="unknown" data-id={node.pointer}>
            <InputWrapper {...widgetInputProps(node, options)} error={`Unknown widget for node at '${node.pointer}'`}>
                <Code block style={{ '--code-bg': 'var(--mantine-color-red-0)' }}>
                    {JSON.stringify(node.schema, null, 2)}
                </Code>
            </InputWrapper>
        </div>
    </WidgetField>
));

export const UnknownWidgetPlugin: WidgetPlugin = {
    id: 'unknown-widget',
    use: () => true,
    Widget: UnknownWidget
};
