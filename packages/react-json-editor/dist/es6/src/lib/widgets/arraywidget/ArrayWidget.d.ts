/// <reference types="react" />
import { ArrayNode, DefaultNodeOptions } from 'headless-json-editor';
import { SemanticCOLORS } from 'semantic-ui-react';
import { WidgetPlugin } from '../decorators';
import { WidgetModalSize } from '../../components/widgetmodal/WidgetModal';
export declare type ArrayOptions = {
    /** additional classnames for array editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    sortable?: {
        enabled?: boolean;
        group?: string;
    };
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: WidgetModalSize;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /** ui layout options for array */
    layout?: {
        /** layout of array children, defaults */
        type?: 'cards' | 'default';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;
export declare const ArrayWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<ArrayNode<ArrayOptions>>) => JSX.Element | null>;
export declare const ArrayWidgetPlugin: WidgetPlugin;
