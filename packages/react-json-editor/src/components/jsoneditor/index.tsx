import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin, JSONSchema, json } from '@sagold/headless-json-editor';
import { useJST } from '../../useJST';

export function JsonEditor({
    schema,
    data,
    onChange
}: {
    schema: JSONSchema;
    data: any;
    onChange: (data: any) => void;
}) {
    const [node, getEditor, instance] = useJST({ schema, onChange, plugins: [RemoteEnumOptionsPlugin], data });
    // @ts-ignore
    window['root'] = node;
    // @ts-ignore
    window['validate'] = () => instance.core.validate(json(node));
    if (node == null) {
        return <></>;
    }

    const ChildEditor = getEditor(node);
    return (
        <section id="editor">
            <Form error style={{ paddingRight: '24px' }}>
                <ChildEditor node={node} instance={instance} getEditor={getEditor} />
            </Form>
            <Form error>
                <ChildEditor node={node} instance={instance} getEditor={getEditor} />
            </Form>
        </section>
    );
}
