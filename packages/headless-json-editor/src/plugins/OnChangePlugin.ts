import { Plugin, HeadlessEditor } from '../HeadlessEditor';
import { Node } from '../types';
import { json } from '../node/json';

// currently using any as we  need toi figure out how to parameterize plugin for use (usePlugin)
export type OnChangeListener<Data = any> = (data: Data, root: Node, editor: HeadlessEditor<Data>) => void;
export type OnChangeOptions<Data = any> = {
    pluginId?: string,
    onChange?: OnChangeListener<Data>
};

/**
 * onChange((data) => do something)
 */
export const OnChangePlugin: Plugin<OnChangeOptions> = (he, options) => {
    const onChange = options.onChange;
    if (typeof onChange !== 'function') {
        return undefined;
    }
    return {
        id: options.pluginId ?? 'onChange',
        onEvent(root, event) {
            if (event.type === 'done') {
                onChange(json(root), root, he);
            }
        }
    };
};
