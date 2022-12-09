/// <reference types="react" />
import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { SemanticICONS } from 'semantic-ui-react';
import { WidgetPlugin } from './decorators';
export declare type StringOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & DefaultNodeOptions;
export declare const StringWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<StringNode<StringOptions>>) => JSX.Element | null>;
export declare const StringWidgetPlugin: WidgetPlugin;
export declare const SelectWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<StringNode<DefaultNodeOptions>>) => JSX.Element | null>;
