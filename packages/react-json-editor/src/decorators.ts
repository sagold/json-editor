import { JsonNode } from 'headless-json-editor';
import { memo, useCallback, ReactNode } from 'react';
import { Editor } from './Editor';

type AnyOption = Record<string, unknown>;

export type WidgetProps<T extends JsonNode = JsonNode> = {
    node: T;
    editor: Editor;
    options?: Partial<T['options']>;
};

/**
 * interface of generic json editor component.
 * it takes the current editor and the current node along with a localized option interface
 */
export type Widget<NodeType extends JsonNode = JsonNode> = (props: WidgetProps<NodeType>) => ReactNode | null;

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
export type DecoratedWidgetProps<NodeType extends JsonNode, ValueType = unknown> = {
    node: NodeType;
    editor: Editor;
    options: NodeType['options'];
    setValue: (value: ValueType) => void;
};

/**
 * interface to your decorated editor
 */
export type DecoratedWidget<NodeType extends JsonNode, ValueType = unknown> = (props: DecoratedWidgetProps<NodeType, ValueType>) => ReactNode | null;

/**
 * add setValue helper to editor component and reduce update cycles
 */
export function widget<NodeType extends JsonNode = JsonNode, ValueType = unknown>(WidgetComponent: DecoratedWidget<NodeType, ValueType>) {
    // eslint-disable-next-line react/display-name
    return memo((props: WidgetProps<NodeType>) => {
        const setValue = useCallback(
            // eslint-disable-next-line react/prop-types
            (value: ValueType) => props.editor.setValue(props.node.pointer, value),
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

export type WidgetPlugin<N extends JsonNode = any> = {
    readonly id: string;
    use: (node: JsonNode, options?: AnyOption) => boolean;
    Widget: Widget<N>;
};
