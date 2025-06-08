import { HeadlessEditor, Plugin, deepEqual } from 'headless-json-editor';
import { useMemo, useRef } from 'react';

/**
 * register a plugin-instance to json-editor
 * Note: plugins having a state will be reset
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
