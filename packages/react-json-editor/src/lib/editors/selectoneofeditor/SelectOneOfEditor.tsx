import { Form, Dropdown, DropdownProps, MenuItemProps, Card, Divider, Menu } from 'semantic-ui-react';
import { JSONSchema } from 'json-schema-library';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { editor, EditorPlugin } from '../decorators';
import { getOptions } from 'headless-json-editor';

type SelectedOneOfSchema = JSONSchema & {
    variableSchema: true;
    oneOfIndex: number;
    oneOfSchema: JSONSchema;
};

export function useSelectOneOfEditor(node, { skipSelectOneOf = false } = {}) {
    return !skipSelectOneOf && node.schema.oneOfSchema && node.schema.oneOfSchema.oneOf.length > 1;
}

export const SelectOneOfEditor = editor(({ instance, node, options }) => {
    const Editor = instance.getEditor(node, { skipSelectOneOf: true });
    const selectedSchema = node.schema as SelectedOneOfSchema;

    const onChange = (e, { value }: DropdownProps) => {
        const schema = selectedSchema.oneOfSchema?.oneOf[`${value}`];
        const data = instance.getTemplateData(schema);
        instance.setValue(node.pointer, data);
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

            <Divider horizontal fitted>
                <Dropdown
                    compact
                    onChange={onChange}
                    value={selectedSchema.oneOfIndex as number}
                    options={selectOptions}
                />
            </Divider>

            <div className="ed-children">
                <Editor node={node} instance={instance} />
            </div>
        </div>
    );
    // return (
    //     <div className="ed-form ed-form--parent ed-oneof">
    //         <Card fluid>
    //             <Card.Content>
    //                 <ParentHeader node={node} options={getOptions(oneOfSchema as JSONSchema, node.property)}>
    //                     <Form.Field id={node.pointer} className="ed-oneof__selection">
    //                         <Dropdown
    //                             selection
    //                             onChange={onChange}
    //                             value={selectedSchema.oneOfIndex as number}
    //                             options={selectOptions}
    //                         />
    //                     </Form.Field>
    //                 </ParentHeader>
    //             </Card.Content>

    //             <Card.Content className="ed-children">
    //                 <Editor node={node} instance={instance} />
    //             </Card.Content>
    //         </Card>
    //     </div>
    // );
});

export const SelectOneOfEditorPlugin: EditorPlugin = {
    id: 'select-oneof-editor',
    use: useSelectOneOfEditor,
    Editor: SelectOneOfEditor
};
