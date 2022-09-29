import { EditorPlugin } from '../types';
import { Form, Dropdown } from 'semantic-ui-react';
import { JSONSchema } from 'json-schema-library';
import { editor } from './decorators';

type SelectedOneOfSchema = JSONSchema & {
    variableSchema: true;
    oneOfIndex: number;
    oneOfSchema: JSONSchema;
};

export function useSelectOneOfEditor(node, { skipSelectOneOf = false } = {}) {
    return !skipSelectOneOf && node.schema.oneOfSchema && node.schema.oneOfSchema.oneOf.length > 1;
}

export const SelectOneOfEditor = editor(({ node, instance, getEditor }) => {
    const Editor = getEditor(node, { skipSelectOneOf: true });
    const selectedSchema = node.schema as SelectedOneOfSchema;

    const onChange = (e, { value }) => {
        // @ts-ignore
        const schema = selectedSchema.oneOfSchema.oneOf[value];
        const data = instance.getTemplateData(schema);
        instance.setValue(node.pointer, data);
    };

    // @ts-ignore
    const options = selectedSchema.oneOfSchema.oneOf.map((s, index) => ({
        key: index,
        value: index,
        text: s.title
    }));

    return (
        <div className="ed-oneof">
            <Form.Field id={node.pointer} className="ed-oneof__selection">
                {/*@ts-ignore*/}
                <Dropdown selection onChange={onChange} value={selectedSchema.oneOfIndex as number} options={options} />
            </Form.Field>
            <Editor node={node} instance={instance} getEditor={getEditor} />
        </div>
    );
});

export const SelectOneOfEditorPlugin: EditorPlugin = {
    id: 'select-oneof-editor',
    use: useSelectOneOfEditor,
    Editor: SelectOneOfEditor
};
