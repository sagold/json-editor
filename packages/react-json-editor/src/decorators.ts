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
export type WidgetComponent<NodeType extends JsonNode = JsonNode> = (props: WidgetProps<NodeType>) => ReactNode | null;

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
export type DecoratedWidget<NodeType extends JsonNode, ValueType = unknown> = (
    props: DecoratedWidgetProps<NodeType, ValueType>
) => ReactNode | null;

/**
 * add setValue helper to editor component and reduce update cycles
 */
export function widget<NodeType extends JsonNode = JsonNode, ValueType = unknown>(
    WidgetComponent: DecoratedWidget<NodeType, ValueType>
) {
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

/**
 * Editor plugin type for widgets
 *
 * @example
 * import { Editor, type WidgetPlugin, type ArrayNode } from "@sagold/rect-json-editor";
 *
 * const ArrayWidgetPlugin: WidgetPlugin<ArrayNode> = {
 *   id: 'array-widget',
 *   use: (node) => node.type === 'array',
 *   Widget: ArrayWidget
 * };
 *
 * // add widget to editor instance
 * const editor = new Editor({ widgets: [ArrayWidgetPlugin, ...defaultWidgets] });
 */
export type WidgetPlugin<N extends JsonNode = any> = {
    /**
     * Unique id of this widget
     */
    readonly id: string;
    /**
     * `use` will select this widget to render the passed JsonNode when true is returned
     *
     * @param node  JsonNode which searches for a matching widget to render
     * @param options   node options and options passed to getWidget function
     * @returns `true` if this widget should be selected to render the node
     */
    use: (node: JsonNode, options?: AnyOption) => boolean;
    /**
     * The widget component to render
     *
     * @example
     * import { type WidgetPlugin, type DecoratedWidgetProps, widget, type StringNode } from "@sagold/rect-json-editor";
     *
     * function MyStringWidget({ editor, node, options, setValue }: DecoratedWidgetProps<StringNode, string>) {}
     *
     * const MyWidgetPlugin: WidgetPlugin<StringNode> = {
     *   id: 'my-string-widget',
     *   use: (node) => node.type === 'string',
     *   Widget: widget(MyStringWidget)
     * };
     *
     * @example // using widget decorator only
     * import { type WidgetPlugin, widget, type StringNode } from "@sagold/rect-json-editor";
     *
     * const MyStringWidget = widget<StringNode, string>(({ editor, node, options, setValue }) {});
     *
     * const MyWidgetPlugin: WidgetPlugin<StringNode> = {
     *   id: 'my-string-widget',
     *   use: (node) => node.type === 'string',
     *   Widget: MyStringWidget
     * };
     *
     */
    Widget: WidgetComponent<N>;
};
