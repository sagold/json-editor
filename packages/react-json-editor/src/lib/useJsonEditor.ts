import { useState, useMemo } from 'react';
import {
    HeadlessJsonEditorOptions,
    Node,
    OnChangePlugin,
    deepEqual,
    HeadlessJsonEditor,
    OnChangeListener
} from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './decorators';
import { usePlugin } from './usePlugin';

export type UseJsonEditorOptions<Data = unknown> = HeadlessJsonEditorOptions<Data> & {
    onChange?: OnChangeListener<Data>;
    widgets?: WidgetPlugin[];
    /** optional cacheKey. Change cacheKey to recreate json-editor */
    cacheKey?: string | number;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    /** set tpo true to validate while typing. Defaults to onBlur */
    liveUpdate?: boolean;
};

// prevent required tooltip in browsers
document.addEventListener('invalid', (e) => e.preventDefault(), true);

/**
 * add json editor widget capabilities to your functional component
 */
export function useJsonEditor<Data = unknown, T extends Node = Node>(
    settings: UseJsonEditorOptions<Data>
): [T, JsonEditor<Data>] {
    const { schema, data, cacheKey } = settings;
    const setCurrentData = useState<Data | undefined>(data)[1];

    // track previous inputs - set data to editor if input values have changed
    const [previousData, setPreviousData] = useState<Data | undefined>(data);
    const [previousSchema, setPreviousSchema] = useState(schema);

    let editorWasCreatedNow = false;
    const editor = useMemo(() => {
        // store last used input data - prevents an additional rerender where
        // last change is lost. this is required in update loops where input
        // data has changed
        setPreviousData(data);
        setPreviousSchema(schema);
        const editor = new JsonEditor<Data>({
            ...settings,
            schema,
            data,
            plugins: settings.plugins,
            widgets: settings.widgets,
            validate: settings.validate,
            liveUpdate: settings.liveUpdate,
            addOptionalProps: settings.addOptionalProps,
            draftConfig: settings.draftConfig
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        editorWasCreatedNow = true;
        return editor;
    },
        // a change of cacheKey completely recreates editor - resetting any changes made
        [cacheKey]
    );

    usePlugin(editor, OnChangePlugin, {
        pluginId: "InternalOnChange",
        onChange(data: Data, root: T, editor: HeadlessJsonEditor) {
            setCurrentData(data);
            if (settings.onChange) {
                settings.onChange(data, root, editor);
            }
        }
    })

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
