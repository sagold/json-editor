/// <reference types="react" />
import { WidgetPlugin } from '../decorators';
import { SemanticCOLORS } from 'semantic-ui-react';
import { DefaultNodeOptions, ParentNode } from 'headless-json-editor';
export declare type MasterDetailOptions = {
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;
/**
 * Master-Detail Editor for object or array values
 */
export declare const MasterDetailWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<ParentNode<MasterDetailOptions>>) => JSX.Element | null>;
export declare const MasterDetailWidgetPlugin: WidgetPlugin;
