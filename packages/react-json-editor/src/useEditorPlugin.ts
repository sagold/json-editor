import { HeadlessEditor, Plugin, deepEqual } from 'headless-json-editor';
import { useMemo, useRef } from 'react';

/**
 * Add a plugin to an editor instance
 *
 * @example
 * import { useEditor, useEditorPlugin } from '@sagold/react-json-editor';
 *
 * function WebFormComponent() {
 *   const editor = useEditor(options)
 *   useEditorPlugin(editor, plugin);
 *
 *   // ...
 *
 * @param editor    to add plugin to. Skips adding plugin if editor is empty
 * @param plugin    plugin to add
 * @param options   plugin options to pass to addPlugin
 */
export function useEditorPlugin<T extends Plugin, E extends HeadlessEditor>(
    editor?: E | null,
    plugin?: T,
    options?: Parameters<T>[1]
) {
    const ref = useRef<Parameters<T>[1]>(options);
    const optionsChanged = options !== ref.current && !deepEqual(options, ref.current);
    return useMemo(
        () => {
            if (editor && plugin) {
                ref.current = options;
                return editor.addPlugin(plugin, options);
            }
            return undefined;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editor, plugin, optionsChanged]
    );
}
