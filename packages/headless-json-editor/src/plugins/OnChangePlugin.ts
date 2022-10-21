import { Plugin, PluginInstance } from '../HeadlessJsonEditor';
import { json } from '../node/json';
import { Node } from '../types';

export type OnChangeListener<T = any> = (data: T, root: Node) => void;

/**
 * onChange((data) => do something)
 */
export const OnChangePlugin: Plugin = (he, options) => {
    const onChange = options.onChange;
    if (typeof onChange !== 'function') {
        return undefined;
    }
    const plugin: PluginInstance = {
        id: 'onChange',
        onEvent(root, event) {
            if (event.type === 'done') {
                onChange(json(root), root);
            }
        }
    };
    return plugin;
};
