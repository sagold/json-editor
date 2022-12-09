/// <reference types="react" />
import { WidgetPlugin } from '../decorators';
export declare function useSelectOneOfWidget(node: any, { skipSelectOneOf }?: {
    skipSelectOneOf?: boolean | undefined;
}): any;
export declare const SelectOneOfWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<import("headless-json-editor").Node>) => JSX.Element | null>;
export declare const SelectOneOfWidgetPlugin: WidgetPlugin;
