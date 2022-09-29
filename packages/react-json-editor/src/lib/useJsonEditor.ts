import { useState, useEffect, useRef } from 'react';
import {
    HeadlessJsonEditor,
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    createOnChangePlugin,
    OnChangeListener,
    JSONSchema
} from 'headless-json-editor';
import { GetEditor, createGetEditor, defaultEditors } from './editors';
import { EditorPlugin } from './editors/decorators';

export type JsonEditorOptions = {
    schema: JSONSchema;
    onChange?: OnChangeListener;
    plugins: Plugin[];
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    editors?: EditorPlugin[];
    data?: unknown;
};

export function useJsonEditor(settings: JsonEditorOptions): [Node | undefined, GetEditor, HeadlessJsonEditor] {
    const { schema, data } = settings;
    const he = useRef<HeadlessJsonEditor>();
    const getEditor = useRef<GetEditor>();
    const [root, setState] = useState<Node>();

    useEffect(() => {
        const { onChange, plugins = [], editors = defaultEditors } = settings;
        getEditor.current = createGetEditor(editors);
        he.current = new HeadlessJsonEditor({
            schema,
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
        setState(he.current.create(data));
    }, [schema, data]);

    return [root, getEditor.current as GetEditor, he.current as HeadlessJsonEditor];
}
