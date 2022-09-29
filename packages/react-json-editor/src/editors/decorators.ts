import { Node, ValueNode, ParentNode, HeadlessJsonEditor } from '@sagold/headless-json-editor';
import { memo } from 'react';
import { GetEditor } from './index';

export type EditorProps<T> = { node: T; instance: HeadlessJsonEditor; getEditor: GetEditor };
const isEqual = (prev, next) => prev.node === next.node;

export type SetValue<T extends ValueNode> = (value: T['value']) => void;
export type ValueEditorProps<T extends ValueNode> = {
    node: T;
    instance: HeadlessJsonEditor;
    getEditor: GetEditor;
    setValue: SetValue<T>;
};
export type ValueEditor<T extends ValueNode> = (props: ValueEditorProps<T>) => JSX.Element;
export function valueEditor<T extends ValueNode>(EditorComponent: ValueEditor<T>): ValueEditor<T> {
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: string) => props.instance.setValue(props.node.pointer, value)
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
export type ParentEditor<T extends ParentNode> = (props: ParentEditorProps<T>) => JSX.Element;
export function parentEditor<T extends ParentNode>(EditorComponent: ParentEditor<T>): ParentEditor<T> {
    // return memo((props: EditorProps<T>) => EditorComponent(props), isEqual);
    return memo(
        (props: EditorProps<T>) =>
            EditorComponent({
                ...props,
                setValue: (value: unknown[]) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type Editor<T extends Node> = (props: EditorProps<T>) => JSX.Element;
export function editor<T extends Node = Node>(EditorComponent: Editor<T>): Editor<T> {
    return memo(EditorComponent, isEqual);
}
