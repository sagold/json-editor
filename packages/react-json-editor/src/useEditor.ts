import { useState, useEffect } from 'react';
import { HeadlessEditorOptions, OnChangePlugin, deepEqual, OnChangeListener } from 'headless-json-editor';
import { Editor } from './Editor';
import { WidgetPlugin } from './decorators';
import { useEditorPlugin } from './useEditorPlugin';

export type UseEditorOptions<Data = unknown> = HeadlessEditorOptions<Data> & {
    /**
     * A function called after each update which that accepts three arguments:
     *
     * - `data` the latest data of the web form
     * - `root` the rootNode of the json-editor and
     * - `editor` the current editor instance
     *
     * _Only supported by useEditor_
     */
    onChange?: OnChangeListener<Data>;
    /**
     * The list of available widgets to render the JSON Schema tree. Each node in the tree should
     * have a matching widget to be rendered or the editor will either ignore or show an error
     * using an Error Widget if added.
     */
    widgets?: WidgetPlugin[];
    /**
     * A unique id that if changed, will recreate the editor
     *
     * _Only supported by useEditor_
     */
    cacheKey?: string | number;
    /** if all optional properties should be added when missing */
    addOptionalProps?: boolean;
    /** set tpo true to validate while typing. Defaults to onBlur */
    liveUpdate?: boolean;
};

// prevent required tooltip in browsers
document?.addEventListener?.('invalid', (e) => e.preventDefault(), true);

/**
 * Create an editor-instance containing a JSON Schema tree, registered widgets and plugins and the
 * overall state of the data.
 *
 * @example
 * import { useEditor } from '@sagold/react-json-editor';
 *
 * function WebFormComponent() {
 *   const editor = useEditor(options);
 *
 *   // ...
 *
 * @caveat when running React.StrictMode the returned editor instance will be undefined on the first call
 * @caveat Each JSON Schema requires a valid JSON Schema type keyword
 *
 * @returns Returns an instance of `Editor`. For details on working with `editor` see Usage below or more in depth details in API Reference on [Editor#instance](/docs/api-editor--docs#instance)
 */
export function useEditor<Data = unknown>(options: UseEditorOptions<Data>) {
    const { schema, data, cacheKey } = options;
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
                ...options,
                schema,
                data,
                drafts: options.drafts,
                plugins: options.plugins,
                widgets: options.widgets,
                validate: options.validate,
                liveUpdate: options.liveUpdate,
                addOptionalProps: options.addOptionalProps,
                extendDefaults: options.extendDefaults
                // draftConfig: options.draftConfig
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
            if (options.onChange) {
                options.onChange(data, root, editor);
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
