import { widget, WidgetPlugin, Widget, JsonSchema, ValueNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Select } from '../../components/select/Select';
import { SectionHeader } from '../../components/sectionheader/SectionHeader';

type SelectedOneOfSchema = JsonSchema & {
    getOneOfOrigin: () => {
        index: number;
        schema: JsonSchema;
        isItem?: boolean;
    };
};

export type OneOfOptions = {
    /** header font size relative to 1 (em). Defaults to 1 */
    headerFontSize?: number;
    descriptionInline?: boolean;
} & DefaultNodeOptions;

export function useSelectOneOfWidget(node, { skipSelectOneOf = false } = {}) {
    const chooseThisWidget = !skipSelectOneOf && !node.isArrayItem && node.schema.getOneOfOrigin;
    return chooseThisWidget;
}

export const SelectOneOfWidget = widget<ValueNode<OneOfOptions>>(({ editor, node, options }) => {
    const selectedSchema = node.schema as SelectedOneOfSchema;
    const origin = selectedSchema.getOneOfOrigin();
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

    const selectOptions = oneOf.map((s, index) => ({
        value: `${index}`,
        text: s.title
    }));

    // const oneOfSchema = origin.schema;

    return (
        <WidgetField widgetType="oneof" node={node} options={options} showDescription={false} showError={false}>
            <WidgetField.Header>
                <SectionHeader>
                    <SectionHeader.Label
                        title={options.title}
                        size={options.headerFontSize}
                        separator={true}
                        description={options.descriptionInline ? undefined : options.description}
                    >
                        <Select
                            id={node.id}
                            // title={options.title}
                            placeholder={options.placeholder}
                            required={options.required}
                            disabled={options.disabled}
                            selectedKey={`${origin.index}`}
                            setValue={onChange}
                        >
                            {selectOptions.map((option, index) => (
                                <Select.Option key={option.value}>{option.text}</Select.Option>
                            ))}
                        </Select>
                    </SectionHeader.Label>

                    {options.descriptionInline && (
                        <WidgetField.Description>{options.description}</WidgetField.Description>
                    )}
                    <WidgetField.Error errors={node.errors} />
                </SectionHeader>
            </WidgetField.Header>

            <div className="rje-children">
                <Widget
                    node={node}
                    editor={editor}
                    options={{ title: undefined, description: undefined, skipSelectOneOf: true }}
                />
            </div>
        </WidgetField>
    );
});

export const SelectOneOfWidgetPlugin: WidgetPlugin = {
    id: 'select-oneof-widget',
    use: useSelectOneOfWidget,
    Widget: SelectOneOfWidget
};
