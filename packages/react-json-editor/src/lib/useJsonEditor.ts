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
import { EditorPlugin } from './editors/decorators';

export type UseJsonEditorOptions = {
    editors: EditorPlugin[];
    schema: JSONSchema;
    data?: unknown;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener;
    plugins?: Plugin[];
};

/**
 * add json editor capabilities to your functional component
 */
export function useJsonEditor<T extends Node = Node>(settings: UseJsonEditorOptions): [undefined] | [T, JsonEditor] {
    const { schema, data } = settings;
    const jsonEditor = useRef<JsonEditor>();
    const [root, setState] = useState<T>();

    useEffect(() => {
        const { onChange, plugins = [], editors } = settings;
        jsonEditor.current = new JsonEditor({
            schema,
            editors,
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
