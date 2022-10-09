import { Form } from 'semantic-ui-react';
import {
    RemoteEnumOptionsPlugin,
    JSONSchema,
    Node,
    json,
    Plugin,
    HeadlessJsonEditorOptions
} from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';
import { defaultEditors } from '../../../index';
import { EditorPlugin } from '../../editors/decorators';

// import { createContext } from 'react';
// export const ModalContext = createContext({});

export type JsonFormProps = {
    schema: JSONSchema;
    data?: unknown;
    editors?: EditorPlugin[];
    plugins?: Plugin[];
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: (data: unknown, root: Node) => void;
};

export function JsonForm({
    schema,
    data,
    editors = defaultEditors,
    plugins = [RemoteEnumOptionsPlugin],
    onChange,
    draft
}: JsonFormProps) {
    const [node, instance] = useJsonEditor({
        schema,
        editors,
        onChange,
        plugins,
        draftConfig: draft,
        data
    });

    // @ts-ignore
    window['jsonNode'] = node;
    // @ts-ignore
    window['validate'] = () => instance.core.validate(json(node));

    if (node == null) {
        return <Form error />;
    }

    const ChildEditor = instance.getEditor(node);
    return (
        <Form error>
            <ChildEditor node={node} instance={instance} />
        </Form>
    );
}
