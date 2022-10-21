import { Form } from 'semantic-ui-react';
import {
    RemoteEnumOptionsPlugin,
    JSONSchema,
    Node,
    get,
    json,
    Plugin,
    isJSONError,
    DefaultNodeOptions,
    HeadlessJsonEditorOptions
} from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';
import { defaultWidgets } from '../../../index';
import { WidgetPlugin } from '../../widgets/decorators';
import { Widget } from '../widget/Widget';
import { JsonEditor } from '../../JsonEditor';
import { MutableRefObject } from 'react';

// import { createContext } from 'react';
// export const ModalContext = createContext({});

export type JsonFormProps = {
    schema: JSONSchema;
    data?: unknown;
    pointer?: string;
    widgets?: WidgetPlugin[];
    plugins?: Plugin[];
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    /** optional root node options */
    options?: Partial<DefaultNodeOptions> & Record<string, unknown>;
    onChange?: (data: unknown, root: Node) => void;
    editor?: MutableRefObject<JsonEditor>;
    /** set to true to initially validate complete data */
    validate?: boolean;
};

export function JsonForm({
    schema,
    data,
    pointer,
    widgets = defaultWidgets,
    plugins = [RemoteEnumOptionsPlugin],
    onChange,
    options,
    draft,
    editor,
    validate
}: JsonFormProps) {
    const [rootNode, instance] = useJsonEditor({
        schema,
        widgets,
        onChange,
        plugins,
        draftConfig: draft,
        data,
        validate
    });

    // @ts-ignore
    window['jsonNode'] = rootNode;
    // @ts-ignore
    window['validate'] = () => instance.core.validate(json(rootNode));

    if (editor) {
        editor.current = instance;
    }

    let node = rootNode;
    if (pointer) {
        const specificRootNode = get(rootNode, pointer);
        if (isJSONError(specificRootNode)) {
            console.error(`There is no node at '${pointer}', returning empty form`);
            return <Form error />;
        }
        node = specificRootNode;
    }

    return (
        <Form error>
            <Widget node={node} instance={instance} options={options} />
        </Form>
    );
}
