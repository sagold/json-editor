import { Plugin, deepEqual } from "headless-json-editor";
import { useMemo, useRef } from "react";
import { JsonEditor } from "./JsonEditor";


/**
 * register a plugin-instance to json-editor
 * Note: plugins having a state will be reset
 */
export function usePlugin<T extends Plugin>(editor: JsonEditor, plugin: T, options?: Record<string, unknown>): ReturnType<T> | undefined {
    const ref = useRef<Record<string, unknown>>();
    const optionsChanged = options !== ref.current && !deepEqual(options, ref.current);
    return useMemo(() => {
        ref.current = options;
        const instance = editor.addPlugin(plugin, options) as ReturnType<T>;
        if (instance) {
            editor.plugins = editor.plugins.filter(p => p === instance || p.id !== instance.id);
            return instance;
        }
        return undefined;
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [editor, plugin, optionsChanged]
    );
}
