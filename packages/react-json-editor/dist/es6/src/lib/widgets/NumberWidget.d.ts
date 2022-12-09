/// <reference types="react" />
import { NumberNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
import { SemanticICONS } from 'semantic-ui-react';
declare type NumberOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & DefaultNodeOptions;
export declare const NumberWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<NumberNode<NumberOptions>>) => JSX.Element | null>;
export declare const NumberWidgetPlugin: WidgetPlugin;
export {};
