import { json } from '../node/json';
/**
 * onChange((data) => do something)
 */
export const OnChangePlugin = (he, options) => {
    const onChange = options.onChange;
    if (typeof onChange !== 'function') {
        return undefined;
    }
    const plugin = {
        id: 'onChange',
        onEvent(root, event) {
            if (event.type === 'done') {
                onChange(json(root), root);
            }
        }
    };
    return plugin;
};
//# sourceMappingURL=OnChangePlugin.js.map