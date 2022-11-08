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
import { MutableRefObject, useRef } from 'react';

export function useEditor() {
    return useRef<JsonEditor>();
}

// import { createContext } from 'react';
// export const ModalContext = createContext({});

export type JsonFormProps = {
    schema: JSONSchema;
    data?: unknown;
    pointer?: string;
    widgets?: WidgetPlugin[];
    plugins?: Plugin[];
    cacheKey?: string | number;
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    /** optional root node options */
    options?: Partial<DefaultNodeOptions> & Record<string, unknown>;
    onChange?: (data: unknown, root: Node) => void;
    ref?: MutableRefObject<JsonEditor | undefined>;
    /** set to true to initially validate complete data */
    validate?: boolean;
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
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
    cacheKey,
    editor,
    validate,
    liveUpdate
}: JsonFormProps) {
    const [rootNode, instance] = useJsonEditor({
        schema,
        widgets,
        onChange,
        plugins,
        draftConfig: draft,
        data,
        cacheKey,
        validate,
        liveUpdate
    });

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
            <Widget node={node} editor={instance} options={options} />
        </Form>
    );
}
