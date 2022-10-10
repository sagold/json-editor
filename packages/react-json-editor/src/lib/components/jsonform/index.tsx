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
import { defaultWidgets } from '../../../index';
import { WidgetPlugin } from '../../widgets/decorators';

// import { createContext } from 'react';
// export const ModalContext = createContext({});

export type JsonFormProps = {
    schema: JSONSchema;
    data?: unknown;
    widgets?: WidgetPlugin[];
    plugins?: Plugin[];
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: (data: unknown, root: Node) => void;
};

export function JsonForm({
    schema,
    data,
    widgets = defaultWidgets,
    plugins = [RemoteEnumOptionsPlugin],
    onChange,
    draft
}: JsonFormProps) {
    const [node, instance] = useJsonEditor({
        schema,
        widgets,
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

    const ChildEditor = instance.getWidget(node);
    return (
        <Form error>
            <ChildEditor node={node} instance={instance} />
        </Form>
    );
}
