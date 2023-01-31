import { Dropdown, DropdownProps, Divider } from 'semantic-ui-react';
import { getOptions } from '@sagold/react-json-editor';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { widget, WidgetPlugin, Widget, JsonSchema } from '@sagold/react-json-editor';

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

    const onChange = (e, { value }: DropdownProps) => {
        const oneOfSchema = oneOf[`${value}`];
        const data = editor.getTemplateData(oneOfSchema);
        editor.setValue(node.pointer, data);
    };

    const selectOptions = oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));

    const oneOfSchema = origin.schema;

    return (
        <div className="rje-form rje-form--parent rje-oneof">
            <ParentHeader node={node} options={getOptions(oneOfSchema as JsonSchema, node.property)} />

            <Divider horizontal>
                <Dropdown
                    compact
                    onChange={onChange}
                    options={selectOptions}
                    readOnly={options.readOnly === true}
                    value={origin.index}
                />
            </Divider>

            <div className="rje-children">
                <Widget
                    node={node}
                    editor={editor}
                    options={{ title: undefined, description: undefined, skipSelectOneOf: true }}
                />
            </div>
        </div>
    );
});

export const SelectOneOfWidgetPlugin: WidgetPlugin = {
    id: 'select-oneof-widget',
    use: useSelectOneOfWidget,
    Widget: SelectOneOfWidget
};
