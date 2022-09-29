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

export type JsonEditorOptions = HeadlessJsonEditorOptions & {
    getEditor: GetEditor;
};

export class JsonEditor extends HeadlessJsonEditor {
    getEditor: GetEditor;

    constructor(settings: JsonEditorOptions) {
        super(settings);
        this.getEditor = settings.getEditor;
    }
}

export type UseJsonEditorOptions = {
    schema: JSONSchema;
    onChange?: OnChangeListener;
    plugins: Plugin[];
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    editors?: EditorPlugin[];
    data?: unknown;
};

export function useJsonEditor(settings: UseJsonEditorOptions): [undefined] | [Node, JsonEditor] {
    const { schema, data } = settings;
    const he = useRef<JsonEditor>();
    const [root, setState] = useState<Node>();

    useEffect(() => {
        const { onChange, plugins = [], editors = defaultEditors } = settings;
        he.current = new JsonEditor({
            schema,
            getEditor: createGetEditor(editors),
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

    if (root != null && he.current != null) {
        return [root, he.current];
    }

    return [undefined];
}
