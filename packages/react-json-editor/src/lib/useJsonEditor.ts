import { useState, useMemo } from 'react';
import {
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    OnChangePlugin,
    OnChangeListener,
    JsonSchema
} from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './widgets/decorators';
import { deepEqual } from 'fast-equals';

export type UseJsonEditorOptions = {
    widgets: WidgetPlugin[];
    schema: JsonSchema;
    data?: unknown;
    validate?: boolean;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener;
    plugins?: Plugin[];
    cacheKey?: string | number;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    liveUpdate?: boolean;
};

// prevent required tooltip in browsers
document.addEventListener('invalid', (e) => e.preventDefault(), true);

/**
 * add json editor widget capabilities to your functional component
 */
export function useJsonEditor<T extends Node = Node>(settings: UseJsonEditorOptions): [T, JsonEditor] {
    const { schema, data, cacheKey } = settings;
    const [currentData, setCurrentData] = useState(data);

    // track previous inputs - set data to editor if input values have changed
    const [previousData, setPreviousData] = useState(data);
    const [previousSchema, setPreviousSchema] = useState(schema);

    // @ts-ignore
    // console.log('<previous value>', previousInput.string, '<current value>', data.string);

    const now = Date.now();
    const editor = useMemo(() => {
        const { onChange, plugins = [], widgets } = settings;
        // store last used input data - prevents an additional rerender where
        // last change is lost. this is required in update loops where input
        // data has changed
        setPreviousData(data);
        setPreviousSchema(schema);
        const editor = new JsonEditor({
            schema,
            data,
            widgets,
            validate: settings.validate,
            liveUpdate: settings.liveUpdate,
            addOptionalProps: settings.addOptionalProps,
            draftConfig: settings.draftConfig,
            plugins: [...plugins, OnChangePlugin],
            onChange(data, root) {
                setCurrentData(data);
                if (onChange) {
                    onChange(data, root);
                }
            }
        });
        // local flag to track if memo was exceuted
        // (and data already up to date)
        // @ts-ignore
        editor.createdAt = now;
        return editor;

        // a change of cacheKey completely recreates editor - resetting any
        // changes made
    }, [cacheKey]);

    // @ts-ignore
    const editorWasCreatedNow = editor.createdAt === now;
    if (editorWasCreatedNow) {
        return [editor.getState() as T, editor];
    }

    if (data !== previousData && !deepEqual(data, previousData)) {
        editor.setData(data);
        setPreviousData(data);
    }

    if (schema !== previousSchema && !deepEqual(schema, previousSchema)) {
        editor.setSchema(schema);
        setPreviousSchema(schema);
    }

    return [editor.getState() as T, editor];
}
