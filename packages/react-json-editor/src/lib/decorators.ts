import { Node } from 'headless-json-editor';
import { memo, useCallback, ReactNode } from 'react';
import { Editor } from './Editor';

type AnyOption = Record<string, unknown>;

export type WidgetProps<T extends Node = Node> = {
    node: T;
    editor: Editor;
    options?: Partial<T['options']>;
};

/**
 * interface of generic json editor component.
 * it takes the current editor and the current node along with a localized option interface
 */
export type Widget<T extends Node = Node> = (props: WidgetProps<T>) => ReactNode | null;

/**
 * react memo node comparison
 */
const isEqual = (prev: WidgetProps, next: WidgetProps) => {
    const equal = prev.node === next.node && prev.options === next.options;
    return equal;
};

/**
 * props of your decorated editor
 */
export type DecoratedWidgetProps<T extends Node, V = unknown> = {
    node: T;
    editor: Editor;
    options: T['options'];
    setValue: (value: V) => void;
};

/**
 * interface to your decorated editor
 */
export type DecoratedWidget<T extends Node, V = unknown> = (props: DecoratedWidgetProps<T, V>) => ReactNode | null;

/**
 * add setValue helper to editor component and reduce update cycles
 */
export function widget<T extends Node = Node, V = unknown>(WidgetComponent: DecoratedWidget<T, V>) {
    // eslint-disable-next-line react/display-name
    return memo((props: WidgetProps<T>) => {
        const setValue = useCallback(
            // eslint-disable-next-line react/prop-types
            (value: V) => props.editor.setValue(props.node.pointer, value),
            // eslint-disable-next-line react-hooks/exhaustive-deps, react/prop-types
            [props.node.id, props.node.pointer, props.editor]
        );
        return WidgetComponent({
            ...props,
            // eslint-disable-next-line react/prop-types
            options: { ...props.node.options, ...props.editor.widgetOptions, ...props.options },
            setValue
        });
    }, isEqual);
}

export type WidgetPlugin<N extends Node = any> = {
    readonly id: string;
    use: (node: Node, options?: AnyOption) => boolean;
    Widget: Widget<N>;
};
