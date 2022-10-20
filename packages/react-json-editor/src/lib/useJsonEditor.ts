import { useState, useMemo } from 'react';
import {
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    createOnChangePlugin,
    OnChangeListener,
    JSONSchema
} from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './widgets/decorators';

export type UseJsonEditorOptions = {
    widgets: WidgetPlugin[];
    schema: JSONSchema;
    data?: unknown;
    validate?: boolean;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener;
    plugins?: Plugin[];
};

/**
 * add json editor widget capabilities to your functional component
 */
export function useJsonEditor<T extends Node = Node>(settings: UseJsonEditorOptions): [T, JsonEditor] {
    const { schema, data, validate = true } = settings;

    const editor = useMemo(() => {
        const { onChange, plugins = [], widgets } = settings;
        const editor = new JsonEditor({
            schema,
            data,
            widgets,
            draftConfig: settings.draftConfig,
            plugins: [
                ...plugins,
                createOnChangePlugin((data, root) => {
                    setState(root as T);
                    if (onChange) {
                        onChange(data, root);
                    }
                })
            ]
        });
        // const node = editor.create(data);
        if (validate === true) {
            editor.validate();
        }
        return editor;
    }, [schema, data]);

    const [root, setState] = useState<T>(editor.getState() as T);
    return [root, editor];
}
