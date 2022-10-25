import { Dropdown, DropdownProps, Divider } from 'semantic-ui-react';
import { getOptions } from 'headless-json-editor';
import { JSONSchema } from 'json-schema-library';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { widget, WidgetPlugin } from '../decorators';
import { Widget } from '../../components/widget/Widget';

type SelectedOneOfSchema = JSONSchema & {
    variableSchema: true;
    oneOfIndex: number;
    oneOfSchema: JSONSchema;
};

export function useSelectOneOfWidget(node, { skipSelectOneOf = false } = {}) {
    return !skipSelectOneOf && node.schema.oneOfSchema && node.schema.oneOfSchema.oneOf.length > 1;
}

export const SelectOneOfWidget = widget(({ editor, node, options }) => {
    const selectedSchema = node.schema as SelectedOneOfSchema;

    const onChange = (e, { value }: DropdownProps) => {
        const schema = selectedSchema.oneOfSchema?.oneOf[`${value}`];
        const data = editor.getTemplateData(schema);
        editor.setValue(node.pointer, data);
    };

    const selectOptions = selectedSchema.oneOfSchema?.oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));

    const { oneOfSchema } = node.schema;

    return (
        <div className="ed-form ed-form--parent ed-oneof">
            <ParentHeader node={node} options={getOptions(oneOfSchema as JSONSchema, node.property)} />

            <Divider horizontal>
                <Dropdown
                    compact
                    onChange={onChange}
                    options={selectOptions}
                    readOnly={options.readOnly === true}
                    value={selectedSchema.oneOfIndex as number}
                />
            </Divider>

            <div className="ed-children">
                <Widget node={node} editor={editor} options={{ title: undefined, skipSelectOneOf: true }} />
            </div>
        </div>
    );
});

export const SelectOneOfWidgetPlugin: WidgetPlugin = {
    id: 'select-oneof-widget',
    use: useSelectOneOfWidget,
    Widget: SelectOneOfWidget
};
