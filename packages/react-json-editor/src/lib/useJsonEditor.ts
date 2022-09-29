import { useState, useEffect, useRef } from 'react';
import {
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    createOnChangePlugin,
    OnChangeListener,
    JSONSchema
} from 'headless-json-editor';
import { defaultEditors } from './editors';
import { JsonEditor } from './JsonEditor';
import { EditorPlugin } from './editors/decorators';

export type UseJsonEditorOptions = {
    data?: unknown;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    editors?: EditorPlugin[];
    onChange?: OnChangeListener;
    plugins: Plugin[];
    schema: JSONSchema;
};

/**
 * add json editor capabilities to your functional component
 */
export function useJsonEditor(settings: UseJsonEditorOptions): [undefined] | [Node, JsonEditor] {
    const { schema, data } = settings;
    const jsonEditor = useRef<JsonEditor>();
    const [root, setState] = useState<Node>();

    useEffect(() => {
        const { onChange, plugins = [], editors = defaultEditors } = settings;
        jsonEditor.current = new JsonEditor({
            schema,
            editors,
            draftConfig: settings.draftConfig,
            plugins: [
                ...plugins,
                createOnChangePlugin((data, root) => {
                    setState(root);
                    // @ts-ignore
                    window['data'] = data;
                    if (settings.onChange) {
                        settings.onChange(data, root);
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
