/// <reference types="react" />
import { Node } from 'headless-json-editor';
import { JsonEditor } from '../JsonEditor';
declare type AnyOption = Record<string, unknown>;
export declare type WidgetProps<T extends Node = Node> = {
    node: T;
    editor: JsonEditor;
    options?: Partial<T['options']>;
};
/**
 * interface of generic json editor component.
 * it takes the current editor and the current node along with a localized option interface
 */
export declare type Widget<T extends Node = Node> = (props: WidgetProps<T>) => JSX.Element | null;
/**
 * props of your decorated editor
 */
export declare type DecoratedWidgetProps<T extends Node, V = unknown> = {
    node: T;
    editor: JsonEditor;
    options: T['options'];
    setValue: (value: V) => void;
};
/**
 * interface to your decorated editor
 */
export declare type DecoratedWidget<T extends Node, V = unknown> = (props: DecoratedWidgetProps<T, V>) => JSX.Element | null;
/**
 * add setValue helper to editor component and reduce update cycles
 */
export declare function widget<T extends Node = Node, V = unknown>(WidgetComponent: DecoratedWidget<T, V>): import("react").MemoExoticComponent<(props: WidgetProps<T>) => JSX.Element | null>;
export declare type WidgetPlugin = {
    readonly id: string;
    use: (node: Node, options?: AnyOption) => boolean;
    Widget: Widget<any>;
};
export {};
