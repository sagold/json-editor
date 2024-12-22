import { Select } from '@mantine/core';
import {
    widget,
    WidgetPlugin,
    Widget,
    JsonSchema,
    ValueNode,
    DefaultNodeOptions,
    WidgetField
} from '@sagold/react-json-editor';
import { WidgetInputWrapper, WidgetInputWrapperProps } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { widgetInputProps } from '../../components/widgetInputProps';
import { WidgetParentHeader } from '../../components/widgetheader/WidgetHeader';

export type OneOfSelectOptions = WidgetInputWrapperProps['options'] & DefaultNodeOptions;

export function useOneOfSelectWidget(node, { skipSelectOneOf = false } = {}) {
    const chooseThisWidget = !skipSelectOneOf && !node.isArrayItem && Array.isArray(node.sourceSchema?.oneOf);
    return chooseThisWidget;
}

export const OneOfSelectWidget = widget<ValueNode<OneOfSelectOptions>>(({ editor, node, options }) => {
    // @ts-expect-error inconsitent types or logic?
    const origin = { schema: node.sourceSchema, index: node.oneOfIndex ?? 0 };
    const oneOf = origin.schema.oneOf as JsonSchema[];
    if (!Array.isArray(oneOf)) {
        console.error('Error in SelectOneOfWidget: Expected oneOfOrigin to contain schema');
        return null;
    }

    const onChange = (value) => {
        const oneOfSchema = oneOf[`${value}`];
        const data = editor.getTemplateData(oneOfSchema);
        editor.setValue(node.pointer, data);
    };

    const widgetHeader = (
        <WidgetParentHeader
            isArrayItem={node.isArrayItem}
            description={options.descriptionInline ? options.description : undefined}
            dividerProps={options.dividerProps}
            required={options.required}
            disabled={options.disabled}
            readOnly={options.readOnly}
            showDivider={options.showTitleDivider ?? true}
            title={
                <Select
                    id={node.id}
                    {...widgetInputProps(node, { ...options, title: undefined, description: undefined })}
                    style={options.description ? { paddingBottom: '0.2em' } : undefined}
                    data={oneOf.map((schema, index) => ({
                        value: `${index}`,
                        label: schema.title ?? `${index}`
                    }))}
                    onChange={onChange}
                    value={`${origin.index}`}
                />
            }
        />
    );

    return (
        <WidgetField widgetType="oneof" node={node} options={options} showDescription={false} showError={false}>
            <WidgetInputWrapper
                errors={node.errors}
                options={{
                    ...options,
                    title: '',
                    required: false,
                    showTitleDivider: options.showTitleDivider ?? true
                }}
                header={widgetHeader}
            >
                <div className="rje-oneOf__children">
                    <Widget
                        node={node}
                        editor={editor}
                        options={{ title: undefined, description: undefined, skipSelectOneOf: true }}
                    />
                </div>
            </WidgetInputWrapper>
        </WidgetField>
    );
});

export const OneOfSelectWidgetPlugin: WidgetPlugin = {
    id: 'oneof-select-widget',
    use: useOneOfSelectWidget,
    Widget: OneOfSelectWidget
};
