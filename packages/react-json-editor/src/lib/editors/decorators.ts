import { Node, ValueNode, ParentNode, HeadlessJsonEditor } from 'headless-json-editor';
import { memo } from 'react';
import { GetEditor } from './index';

export type EditorProps<T> = {
    node: T;
    instance: HeadlessJsonEditor;
    getEditor: GetEditor;
};

const isEqual = (prev: { node: Node }, next: { node: Node }) => prev.node === next.node;

export type SetValue<T extends ValueNode> = (value: T['value']) => void;

export type ValueEditorProps<T extends ValueNode> = {
    node: T;
    instance: HeadlessJsonEditor;
    getEditor: GetEditor;
    setValue: SetValue<T>;
};

export type ValueEditor<T extends ValueNode> = (props: ValueEditorProps<T>) => JSX.Element | null;

export function valueEditor<T extends ValueNode>(EditorComponent: ValueEditor<T>): Editor<any> {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: T['value']) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type SetParent = (value: unknown[] | Record<string, unknown>) => void;

export type ParentEditorProps<T extends ParentNode> = {
    node: T;
    instance: HeadlessJsonEditor;
    getEditor: GetEditor;
    setValue: SetParent;
};
export type ParentEditor<T extends ParentNode> = (props: ParentEditorProps<T>) => JSX.Element | null;

export function parentEditor<T extends ParentNode>(EditorComponent: ParentEditor<T>): Editor<any> {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: unknown[] | Record<string, unknown>) =>
                    props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type DecoratedEditorProps<T extends Node> = {
    node: T;
    instance: HeadlessJsonEditor;
    getEditor: GetEditor;
    setValue: (value: unknown) => void;
};

export type Editor<T extends Node = Node> = (props: EditorProps<T>) => JSX.Element | null;

export type DecoratedEditor<T extends Node> = (props: DecoratedEditorProps<T>) => JSX.Element | null;

export function editor<T extends Node = Node>(EditorComponent: DecoratedEditor<T>): Editor<T> {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: unknown) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type EditorPlugin = {
    readonly id: string;
    use: (node: Node, options?: Record<string, unknown>) => boolean;
    Editor: Editor;
};
