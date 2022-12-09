/// <reference types="react" />
import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
export declare type TextWidgetOptions = {
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & DefaultNodeOptions;
export declare const TextWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<StringNode<TextWidgetOptions>>) => JSX.Element | null>;
export declare const TextWidgetPlugin: WidgetPlugin;
