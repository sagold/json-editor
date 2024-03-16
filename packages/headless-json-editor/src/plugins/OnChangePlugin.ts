import { Plugin, HeadlessEditor } from '../HeadlessEditor';
import { Node } from '../types';
import { getData } from '../node/getData';

// currently using any as we  need toi figure out how to parameterize plugin for use (usePlugin)
export type OnChangeListener<Data = any> = (data: Data, root: Node, editor: HeadlessEditor<Data>) => void;
export type OnChangeOptions<Data = any> = {
    /** add custom plugin-id to avoid collisions with different OnChangePlugins */
    pluginId?: string,
    /** add onChange callback to get notified after something (data, schema, errors, etc) changed */
    onChange?: OnChangeListener<Data>
};

/**
 * Add onChange callback after update events
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
                onChange(getData(root), root, he);
            }
        }
    };
};
