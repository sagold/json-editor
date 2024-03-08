import { Plugin, PluginInstance, HeadlessJsonEditorInterface } from './Plugin';
import { json } from '../node/json';
import { Node } from '../types';

export type OnChangeListener<Data = unknown> = (data: Data, root: Node, editor: HeadlessJsonEditorInterface) => void;
export type OnChangeOptions = {
    pluginId?: string,
    onChange?: OnChangeListener
};

/**
 * onChange((data) => do something)
 */
export const OnChangePlugin: Plugin<OnChangeOptions> = (he, options) => {
    const onChange = options.onChange;
    if (typeof onChange !== 'function') {
        return undefined;
    }

    const plugin: PluginInstance = {
        id: options.pluginId ?? 'onChange',
        onEvent(root, event) {
            if (event.type === 'done') {
                onChange(json(root), root, he);
            }
        }
    };
    return plugin;
};
