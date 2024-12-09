import { DefaultNodeOptions, NullNode, widget, WidgetField, WidgetPlugin } from '@sagold/react-json-editor';
import { WidgetInputWrapper, WidgetInputWrapperProps } from '../../components/widgetinputwrapper/WidgetInputWrapper';

export type NullOptions = WidgetInputWrapperProps['options'] & DefaultNodeOptions;

export const NullWidget = widget<NullNode<NullOptions>, null>(({ node, options }) => {
    return (
        <WidgetField widgetType="null" node={node} options={options} showDescription={false} showError={false}>
            <WidgetInputWrapper options={options} errors={node.errors} />
        </WidgetField>
    );
});

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
