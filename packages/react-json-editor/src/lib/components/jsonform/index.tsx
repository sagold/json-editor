import { RemoteEnumOptionsPlugin, get, isJsonError, DefaultNodeOptions } from 'headless-json-editor';
import { useJsonEditor, UseJsonEditorOptions } from '../../useJsonEditor';
import { Widget } from '../widget/Widget';
import { JsonEditor } from '../../JsonEditor';
import { useImperativeHandle } from 'react';

export type JsonFormProps<Data = unknown> = UseJsonEditorOptions<Data> & {
    pointer?: string;
    editor?: (editor: JsonEditor<Data>) => void;
    /** optional root node options */
    options?: Partial<DefaultNodeOptions> & Record<string, unknown>;
    /** custom styles applied for form element */
    style?: React.CSSProperties;
};

export function JsonForm<Data = unknown>({
    schema,
    data,
    editor,
    className,
    pointer,
    widgets,
    plugins = [RemoteEnumOptionsPlugin],
    onChange,
    options,
    draftConfig,
    cacheKey,
    validate,
    liveUpdate,
    addOptionalProps,
    style
}: JsonFormProps<Data>) {
    const [rootNode, instance] = useJsonEditor({
        schema,
        widgets,
        onChange,
        plugins,
        draftConfig,
        data,
        cacheKey,
        validate,
        addOptionalProps,
        liveUpdate
    });

    useImperativeHandle(editor, () => instance);

    let node = rootNode;
    if (pointer) {
        const specificRootNode = get(rootNode, pointer);
        if (isJsonError(specificRootNode)) {
            console.error(`There is no node at '${pointer}', returning empty form`);
            return <div className={`rje-form ${className ?? ''}`.trim()} style={style} />;
        }
        node = specificRootNode;
    }

    return (
        <div className={`rje-form ${className ?? ''}`.trim()} style={style}>
            <Widget node={node} editor={instance} options={options} />
        </div>
    );
}
