import { useState, useMemo } from 'react';
import {
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    OnChangePlugin,
    OnChangeListener,
    JSONSchema
} from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './widgets/decorators';
import { deepEqual } from 'fast-equals';
// import diff from 'microdiff';

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
    const { schema, data } = settings;
    const [currentData, setCurrentData] = useState(data);
    const [previousInput, updatePreviousInput] = useState(data);
    const [previousSchema, updatePreviousSchema] = useState(schema);
    // @ts-ignore
    // console.log('<previous value>', previousInput.string, '<current value>', data.string);

    const editor = useMemo(() => {
        const { onChange, plugins = [], widgets } = settings;
        return new JsonEditor({
            schema,
            data,
            widgets,
            validate: settings.validate,
            draftConfig: settings.draftConfig,
            plugins: [...plugins, OnChangePlugin],
            onChange(data, root) {
                setCurrentData(data);
                if (onChange) {
                    onChange(data, root);
                }
            }
        });
    }, []);

    if (data !== previousInput && !deepEqual(data, previousInput)) {
        editor.setData(data);
        updatePreviousInput(data);
    }

    if (schema !== previousSchema && !deepEqual(schema, previousSchema)) {
        editor.setSchema(schema);
        updatePreviousSchema(schema);
    }

    return [editor.getState() as T, editor];
}
