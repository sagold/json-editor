import { HeadlessJsonEditor, Plugin } from '../HeadlessJsonEditor';
import { json } from '../node/json';
import { Node } from '../types';

export type OnChangeListener<T = any> = (data: T, root: Node) => void;

/**
 * onChange((data) => do something)
 */
export function createOnChangePlugin(onChangeListener: OnChangeListener): Plugin {
    if (onChangeListener == null) {
        return {
            id: 'onChange',
            create: () => false
        };
    }

    return {
        id: 'onChange',
        create() {
            return function onChange(root, event) {
                if (event.type === 'done') {
                    onChangeListener(json(root), root);
                }
            };
        }
    };
}
