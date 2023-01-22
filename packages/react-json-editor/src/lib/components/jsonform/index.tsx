import { Form } from 'semantic-ui-react';
import {
    RemoteEnumOptionsPlugin,
    JsonSchema,
    Node,
    get,
    Plugin,
    isJsonError,
    DefaultNodeOptions,
    HeadlessJsonEditorOptions
} from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';
import { defaultWidgets } from '../../../index';
import { WidgetPlugin } from '../../widgets/decorators';
import { Widget } from '../widget/Widget';
import { JsonEditor } from '../../JsonEditor';
import { forwardRef, useImperativeHandle } from 'react';

// import { createContext } from 'react';
// export const ModalContext = createContext({});

export type JsonFormProps = {
    schema: JsonSchema;
    data?: unknown;
    pointer?: string;
    widgets?: WidgetPlugin[];
    plugins?: Plugin[];
    cacheKey?: string | number;
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    /** optional root node options */
    options?: Partial<DefaultNodeOptions> & Record<string, unknown>;
    onChange?: (data: unknown, root: Node) => void;
    /** set to true to initially validate complete data */
    validate?: boolean;
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    style?: React.CSSProperties;
};

export const JsonForm = forwardRef<JsonEditor, JsonFormProps>(function JsonForm(
    {
        schema,
        data,
        pointer,
        widgets = defaultWidgets,
        plugins = [RemoteEnumOptionsPlugin],
        onChange,
        options,
        draft,
        cacheKey,
        validate,
        liveUpdate,
        addOptionalProps,
        style
    },
    ref
) {
    const [rootNode, instance] = useJsonEditor({
        schema,
        widgets,
        onChange,
        plugins,
        draftConfig: draft,
        data,
        cacheKey,
        validate,
        addOptionalProps,
        liveUpdate
    });

    useImperativeHandle(ref, () => instance);

    let node = rootNode;
    if (pointer) {
        const specificRootNode = get(rootNode, pointer);
        if (isJsonError(specificRootNode)) {
            console.error(`There is no node at '${pointer}', returning empty form`);
            return <Form error />;
        }
        node = specificRootNode;
    }

    return (
        <Form error style={style}>
            <Widget node={node} editor={instance} options={options} />
        </Form>
    );
});
