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
    plugins: Plugin[];
};

/**
 * add json editor capabilities to your functional component
 */
export function useJsonEditor(settings: UseJsonEditorOptions): [undefined] | [Node, JsonEditor] {
    const { schema, data } = settings;
    const jsonEditor = useRef<JsonEditor>();
    const [root, setState] = useState<Node>();

    useEffect(() => {
        const { onChange, plugins = [], editors } = settings;
        jsonEditor.current = new JsonEditor({
            schema,
            editors,
            draftConfig: settings.draftConfig,
            plugins: [
                ...plugins,
                createOnChangePlugin((data, root) => {
                    setState(root);
                    if (onChange) {
                        onChange(data, root);
                    }
                })
            ]
        });
        setState(jsonEditor.current.create(data));
    }, [schema, data]);

    if (root != null && jsonEditor.current != null) {
        return [root, jsonEditor.current];
    }

    return [undefined];
}
