/// <reference types="react" />
import { StringNode, ParentNode } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
export declare const SimpleJsonWidget: (props: any) => JSX.Element;
export declare const SimpleJsonStringWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<StringNode<import("headless-json-editor").DefaultNodeOptions>>) => JSX.Element | null>;
export declare const SimpleJsonDataWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<ParentNode<import("headless-json-editor").DefaultNodeOptions>>) => JSX.Element | null>;
export declare const SimpleJsonWidgetPlugin: WidgetPlugin;
