import { Form, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import { JSONSchema } from 'json-schema-library';
import { editor, EditorPlugin } from './decorators';

type SelectedOneOfSchema = JSONSchema & {
    variableSchema: true;
    oneOfIndex: number;
    oneOfSchema: JSONSchema;
};

export function useSelectOneOfEditor(node, { skipSelectOneOf = false } = {}) {
    return !skipSelectOneOf && node.schema.oneOfSchema && node.schema.oneOfSchema.oneOf.length > 1;
}

export const SelectOneOfEditor = editor(({ instance, node }) => {
    const Editor = instance.getEditor(node, { skipSelectOneOf: true });
    const selectedSchema = node.schema as SelectedOneOfSchema;

    const onChange = (e, { value }: DropdownProps) => {
        const schema = selectedSchema.oneOfSchema.oneOf[`${value}`];
        const data = instance.getTemplateData(schema);
        instance.setValue(node.pointer, data);
    };

    const selectOptions = selectedSchema.oneOfSchema.oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));

    return (
        <div className="ed-form ed-value ed-oneof">
            <Form.Field id={node.pointer} className="ed-oneof__selection">
                <Dropdown
                    selection
                    onChange={onChange}
                    value={selectedSchema.oneOfIndex as number}
                    options={selectOptions}
                />
            </Form.Field>
            <Editor node={node} instance={instance} />
        </div>
    );
});

export const SelectOneOfEditorPlugin: EditorPlugin = {
    id: 'select-oneof-editor',
    use: useSelectOneOfEditor,
    Editor: SelectOneOfEditor
};
