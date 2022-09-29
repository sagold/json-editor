import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin, JSONSchema, json } from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';

export type JsonEditorProps = {
    schema: JSONSchema;
    data: unknown;
    onChange: (data: unknown) => void;
};

export function JsonEditor({ schema, data, onChange }: JsonEditorProps) {
    const [node, getEditor, instance] = useJsonEditor({ schema, onChange, plugins: [RemoteEnumOptionsPlugin], data });
    // @ts-ignore
    window['root'] = node;
    // @ts-ignore
    window['validate'] = () => instance.core.validate(json(node));
    if (node == null) {
        return <></>;
    }

    const ChildEditor = getEditor(node);
    return (
        <Form error>
            <ChildEditor node={node} instance={instance} getEditor={getEditor} />
        </Form>
    );
}
