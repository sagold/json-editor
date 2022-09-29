import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin, JSONSchema, json } from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';

export type JsonFormProps = {
    schema: JSONSchema;
    data: unknown;
    onChange: (data: unknown) => void;
};

export function JsonForm({ schema, data, onChange }: JsonFormProps) {
    const [node, instance] = useJsonEditor({ schema, onChange, plugins: [RemoteEnumOptionsPlugin], data });
    // @ts-ignore
    window['root'] = node;
    // @ts-ignore
    window['validate'] = () => instance.core.validate(json(node));
    if (node == null) {
        return <></>;
    }

    const ChildEditor = instance.getEditor(node);
    return (
        <Form error>
            <ChildEditor node={node} instance={instance} />
        </Form>
    );
}
