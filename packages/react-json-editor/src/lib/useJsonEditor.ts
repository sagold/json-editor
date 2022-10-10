import { useState, useEffect, useRef } from 'react';
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
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener;
    plugins?: Plugin[];
};

/**
 * add json editor widget capabilities to your functional component
 */
export function useJsonEditor<T extends Node = Node>(settings: UseJsonEditorOptions): [undefined] | [T, JsonEditor] {
    const { schema, data } = settings;
    const jsonEditor = useRef<JsonEditor>();
    const [root, setState] = useState<T>();

    useEffect(() => {
        const { onChange, plugins = [], widgets } = settings;
        jsonEditor.current = new JsonEditor({
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
        const node = jsonEditor.current.create(data);
        jsonEditor.current.validate();
        setState(node as T);
    }, [schema, data]);

    if (root != null && jsonEditor.current != null) {
        return [root, jsonEditor.current];
    }

    return [undefined];
}
