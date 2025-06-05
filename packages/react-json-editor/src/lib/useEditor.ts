import { useState, useEffect } from 'react';
import { HeadlessEditorOptions, OnChangePlugin, deepEqual, OnChangeListener } from 'headless-json-editor';
import { Editor } from './Editor';
import { WidgetPlugin } from './decorators';
import { useEditorPlugin } from './useEditorPlugin';

export type UseEditorOptions<Data = unknown> = HeadlessEditorOptions<Data> & {
    // editor?: Editor<Data> | null;
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
document?.addEventListener?.('invalid', (e) => e.preventDefault(), true);

/**
 * add json editor widget capabilities to your functional component
 */
export function useEditor<Data = unknown>(settings: UseEditorOptions<Data>) {
    const { schema, data, cacheKey } = settings;
    // track instance
    const [editor, setEditor] = useState<Editor<Data> | null>(null);
    // track current data
    const setCurrentData = useState<Data | null>(data ?? null)[1];
    // track previous inputs - set data to editor if input values have changed
    const [previousData, setPreviousData] = useState<Data | undefined>(data);
    const [previousSchema, setPreviousSchema] = useState(schema);

    useEffect(
        () => {
            const instance = new Editor<Data>({
                ...settings,
                schema,
                data,
                drafts: settings.drafts,
                plugins: settings.plugins,
                widgets: settings.widgets,
                validate: settings.validate,
                liveUpdate: settings.liveUpdate,
                addOptionalProps: settings.addOptionalProps,
                extendDefaults: settings.extendDefaults
                // draftConfig: settings.draftConfig
            });
            // console.log('create editor', instance.id);
            // store last used input data - prevents an additional rerender where
            // last change is lost. this is required in update loops where input
            // data has changed
            setEditor(instance);
            setPreviousData(data);
            setPreviousSchema(schema);
            return () => {
                instance?.destroy();
                setEditor(null);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [cacheKey, setEditor]
    );

    useEditorPlugin(editor, OnChangePlugin, {
        pluginId: 'InternalOnChange',
        onChange(data, root, editor) {
            setCurrentData(data);
            if (settings.onChange) {
                settings.onChange(data, root, editor);
            }
        }
    });

    if (editor == null) {
        return editor;
    }

    // @todo move data comparisson to editor method
    if (data !== previousData && !deepEqual(data, previousData)) {
        editor.setData(data);
        setPreviousData(data);
    }

    if (schema !== previousSchema && !deepEqual(schema, previousSchema)) {
        editor.setSchema(schema);
        setPreviousSchema(schema);
    }

    return editor;
}
