/// <reference types="react" />
import { ArrayNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from '../decorators';
export declare type ColumnConfig = {
    key: string;
    title?: string;
};
export declare type TableOptions = {
    table: {
        columns?: ColumnConfig[];
    };
} & DefaultNodeOptions;
/**
 * @todo maybe better to use ag-grid
 */
export declare const TableWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<ArrayNode<TableOptions>>) => JSX.Element | null>;
export declare const TableWidgetPlugin: WidgetPlugin;
