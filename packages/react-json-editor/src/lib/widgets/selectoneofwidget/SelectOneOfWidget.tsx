import { Dropdown, DropdownProps, Divider } from 'semantic-ui-react';
import { getOptions } from 'headless-json-editor';
import { JsonSchema } from 'json-schema-library';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { widget, WidgetPlugin } from '../decorators';
import { Widget } from '../../components/widget/Widget';

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

    const onChange = (e, { value }: DropdownProps) => {
        const schema = origin.schema.oneOf[`${value}`];
        const data = editor.getTemplateData(schema);
        editor.setValue(node.pointer, data);
    };

    const selectOptions = origin.schema.oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));

    const oneOfSchema = origin.schema;

    return (
        <div className="ed-form ed-form--parent ed-oneof">
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

            <div className="ed-children">
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
