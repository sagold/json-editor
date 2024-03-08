import { useState, useMemo } from 'react';
import {
    HeadlessJsonEditorOptions,
    Plugin,
    Node,
    OnChangePlugin,
    OnChangeListener,
    JsonSchema,
    deepEqual,
    PluginConfig,
    HeadlessJsonEditor
} from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './decorators';

export type UseJsonEditorOptions<Data = unknown> = {
    widgets?: WidgetPlugin[];
    schema: JsonSchema;
    data?: Data;
    validate?: boolean;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener<Data>;
    /** list of plugins to use. Prefer usePlugin-hook */
    plugins?: (Plugin | PluginConfig)[];
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
    const [currentData, setCurrentData] = useState<Data | undefined>(data);

    // track previous inputs - set data to editor if input values have changed
    const [previousData, setPreviousData] = useState<Data | undefined>(data);
    const [previousSchema, setPreviousSchema] = useState(schema);

    // @ts-ignore
    // console.log('<previous value>', previousInput.string, '<current value>', data.string);

    let editorWasCreatedNow = false;
    const editor = useMemo(() => {
        const { onChange, plugins = [], widgets } = settings;

        // store last used input data - prevents an additional rerender where
        // last change is lost. this is required in update loops where input
        // data has changed
        setPreviousData(data);
        setPreviousSchema(schema);
        const editor = new JsonEditor<Data>({
            ...settings,
            schema,
            data,
            widgets,
            validate: settings.validate,
            liveUpdate: settings.liveUpdate,
            addOptionalProps: settings.addOptionalProps,
            draftConfig: settings.draftConfig,
            plugins: [...plugins, {
                plugin: OnChangePlugin,
                options: {
                    pluginId: "InternalOnChange",
                    onChange(data: Data, root: T, editor: HeadlessJsonEditor) {
                        setCurrentData(data);
                        if (onChange) {
                            onChange(data, root, editor);
                        }
                    }
                }
            }],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        editorWasCreatedNow = true;
        return editor;
    },
        // a change of cacheKey completely recreates editor - resetting any changes made
        [cacheKey]
    );

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
