import { DefaultNodeOptions, NullNode, widget, WidgetField, WidgetPlugin } from '@sagold/react-json-editor';
import { WidgetInputWrapper, WidgetInputWrapperProps } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { WidgetParentHeader } from '../../components/widgetheader/WidgetHeader';
import { TitleOrder } from '@mantine/core';

export type NullOptions = {
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
} & WidgetInputWrapperProps['options'] &
    DefaultNodeOptions;

export const NullWidget = widget<NullNode<NullOptions>, null>(({ node, options }) => {
    const depth = Math.min(6, node.pointer.split('/').length);
    const order = options.titleProps?.order ?? ((depth === 1 ? 1 : 2) as TitleOrder);
    const widgetHeader = WidgetParentHeader.isEmpty(options) ? undefined : (
        <WidgetParentHeader
            isArrayItem={node.isArrayItem}
            title={options.title}
            order={order}
            titleProps={options.titleProps}
            description={options.descriptionInline ? options.description : undefined}
            dividerProps={options.dividerProps}
            required={options.required}
            disabled={options.disabled}
            readOnly={options.readOnly}
            showDivider={options.showTitleDivider ?? true}
        />
    );
    return (
        <WidgetField widgetType="null" node={node} options={options} showDescription={false} showError={false}>
            <WidgetInputWrapper options={options} errors={node.errors} header={widgetHeader} />
        </WidgetField>
    );
});

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
