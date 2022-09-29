import { JST, Plugin } from '../JST';
import { json } from '../node/json';
import { Node } from '../node/types';

export type OnChangeListener<T = any> = (data: T, root: Node) => void;

/**
 * onChange((data) => do something)
 */
export function createOnChangePlugin(onChangeListener: OnChangeListener): Plugin {
    if (onChangeListener == null) {
        return { create: () => false };
    }

    return {
        create(jst: JST) {
            return function onChange(root, event) {
                if (event.type === 'done') {
                    onChangeListener(json(root), root);
                }
            };
        }
    };
}
