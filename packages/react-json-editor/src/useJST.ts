import { JSONSchema } from 'json-schema-library';
import { useState, useEffect, useRef } from 'react';
import { JST, Plugin, Node, createOnChangePlugin, OnChangeListener } from '@sagold/headless-json-editor';
import { GetEditor, createGetEditor, defaultEditors } from './editors';
import { EditorPlugin } from './types';

export type JSTOptions = {
    schema: JSONSchema;
    onChange?: OnChangeListener;
    plugins: Plugin[];
    editors?: EditorPlugin[];
    data?: unknown;
};

export function useJST(settings: JSTOptions): [Node | undefined, GetEditor, JST] {
    const { schema, data } = settings;
    const jst = useRef<JST>();
    const getEditor = useRef<GetEditor>();
    const [root, setState] = useState<Node>();

    useEffect(() => {
        const { onChange, plugins = [], editors = defaultEditors } = settings;
        getEditor.current = createGetEditor(editors);
        jst.current = new JST({
            schema,
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
        setState(jst.current.create(data));
    }, [schema, data]);

    return [root, getEditor.current, jst.current];
}
