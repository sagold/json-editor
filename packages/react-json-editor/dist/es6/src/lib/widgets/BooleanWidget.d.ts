/// <reference types="react" />
import { BooleanNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from './decorators';
export declare type BooleanOptions = {
    type?: 'checkbox' | 'toggle';
} & DefaultNodeOptions;
export declare const booleanDefaultOptions: {
    type: string;
};
export declare const BooleanWidget: import("react").MemoExoticComponent<(props: import("./decorators").WidgetProps<BooleanNode<BooleanOptions>>) => JSX.Element | null>;
export declare const BooleanWidgetPlugin: WidgetPlugin;
