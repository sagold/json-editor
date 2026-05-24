import { Plugin, HeadlessEditor } from '../HeadlessEditor';
import { JsonNode } from '../types';
import { getData } from '../node/getData';

/**
 * A function called after each udpate which that accepts three arguments:
 *
 *  - data the latest data of the web form
 *  - root the rootNode of the json-editor and
 *  - editor the current editor instance
 */
export type OnChangeListener<Data = any> = (data: Data, root: JsonNode, editor: HeadlessEditor<Data>) => void;
export type OnChangeOptions<Data = any> = {
    /** add custom plugin-id to avoid collisions with different OnChangePlugins */
    pluginId?: string;
    /** add onChange callback to get notified after something (data, schema, errors, etc) changed */
    onChange?: OnChangeListener<Data>;
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
