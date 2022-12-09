/// <reference types="react" />
import { StringNode, Node } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
export declare const MultiSelectWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<StringNode<import("headless-json-editor").DefaultNodeOptions>>) => JSX.Element | null>;
export declare function useMultiSelectWidget(node: Node): boolean;
export declare const MultiSelectWidgetPlugin: WidgetPlugin;
