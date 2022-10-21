import { Node } from 'headless-json-editor';
import { memo } from 'react';
import { JsonEditor } from '../JsonEditor';

type AnyOption = Record<string, unknown>;

export type WidgetProps<T extends Node = Node> = {
    node: T;
    instance: JsonEditor;
    options?: Partial<T['options']>;
};

/**
 * interface of generic json editor component.
 * it takes the current instance and the current node along with a localized option interface
 */
export type Widget<T extends Node = Node> = (props: WidgetProps<T>) => JSX.Element | null;

/**
 * react memo node comparison
 */
const isEqual = (prev: WidgetProps, next: WidgetProps) => prev.node === next.node && prev.options === next.options;

/**
 * props of your decorated editor
 */
export type DecoratedWidgetProps<T extends Node, V = unknown> = {
    node: T;
    instance: JsonEditor;
    options: T['options'];
    setValue: (value: V) => void;
};

/**
 * interface to your decorated editor
 */
export type DecoratedWidget<T extends Node, V = unknown> = (props: DecoratedWidgetProps<T, V>) => JSX.Element | null;

/**
 * add setValue helper to editor component and reduce update cycles
 */
export function widget<T extends Node = Node, V = unknown>(WidgetComponent: DecoratedWidget<T, V>) {
    return memo(
        (props: WidgetProps<T>) =>
            WidgetComponent({
                ...props,
                options: { ...props.node.options, ...props.options },
                setValue: (value: V) => props.instance.setValue(props.node.pointer, value)
            }),
        isEqual
    );
}

export type WidgetPlugin = {
    readonly id: string;
    use: (node: Node, options?: AnyOption) => boolean;
    Widget: Widget<any>;
};