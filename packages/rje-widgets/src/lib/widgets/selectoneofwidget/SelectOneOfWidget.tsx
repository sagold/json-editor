import { widget, WidgetPlugin, Widget, JsonSchema } from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { Select } from '../../components/select/Select';

type SelectedOneOfSchema = JsonSchema & {
    getOneOfOrigin: () => {
        index: number;
        schema: JsonSchema;
        isItem?: boolean;
    };
};

export function useSelectOneOfWidget(node, { skipSelectOneOf = false } = {}) {
    const chooseThisWidget = !skipSelectOneOf && !node.isArrayItem && node.schema.getOneOfOrigin;
    return chooseThisWidget;
}

export const SelectOneOfWidget = widget(({ editor, node, options }) => {
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
                <WidgetField.Bar>
                    <Select
                        id={node.id}
                        title={options.title}
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
                </WidgetField.Bar>
                <WidgetField.Description>{options.description}</WidgetField.Description>
                <WidgetField.Error errors={node.errors} />
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
