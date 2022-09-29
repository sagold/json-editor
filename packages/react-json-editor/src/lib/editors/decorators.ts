import { Node } from 'headless-json-editor';
import { memo } from 'react';
import { GetEditor } from './index';
import { JsonEditor } from '../useJsonEditor';

export type EditorProps<T> = {
    node: T;
    instance: JsonEditor;
};

const isEqual = (prev: { node: Node }, next: { node: Node }) => prev.node === next.node;

export type DecoratedEditorProps<T extends Node, V = unknown> = {
    node: T;
    instance: JsonEditor;
    setValue: (value: V) => void;
};

export type Editor<T extends Node = Node> = (props: EditorProps<T>) => JSX.Element | null;

export type DecoratedEditor<T extends Node, V = unknown> = (props: DecoratedEditorProps<T, V>) => JSX.Element | null;

export function editor<T extends Node = Node, V = unknown>(EditorComponent: DecoratedEditor<T, V>): Editor<any> {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: V) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type EditorPlugin = {
    readonly id: string;
    use: (node: Node, options?: Record<string, unknown>) => boolean;
    Editor: Editor;
};
