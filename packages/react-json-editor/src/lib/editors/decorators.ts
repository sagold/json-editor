import { Node } from 'headless-json-editor';
import { memo } from 'react';
import { JsonEditor } from '../JsonEditor';

type AnyOption = Record<string, unknown>;

export type EditorProps<T extends Node = Node> = {
    node: T;
    instance: JsonEditor;
    options?: Partial<T['options']>;
};

/**
 * interface of generic json editor component.
 * it takes the current instance and the current node along with a localized option interface
 */
export type Editor<T extends Node = Node> = (props: EditorProps<T>) => JSX.Element | null;

/**
 * react memo node comparison
 */
const isEqual = (prev: EditorProps, next: EditorProps) => prev.node === next.node && prev.options === next.options;

/**
 * props of your decorated editor
 */
export type DecoratedEditorProps<T extends Node, V = unknown> = {
    node: T;
    instance: JsonEditor;
    options: T['options'];
    setValue: (value: V) => void;
};

/**
 * interface to your decorated editor
 */
export type DecoratedEditor<T extends Node, V = unknown> = (props: DecoratedEditorProps<T, V>) => JSX.Element | null;

/**
 * add setValue helper to editor component and reduce update cycles
 */
export function editor<T extends Node = Node, V = unknown>(EditorComponent: DecoratedEditor<T, V>) {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                options: { ...props.node.options, ...props.options },
                setValue: (value: V) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type EditorPlugin = {
    readonly id: string;
    use: (node: Node, options?: AnyOption) => boolean;
    Editor: Editor<any>;
};
