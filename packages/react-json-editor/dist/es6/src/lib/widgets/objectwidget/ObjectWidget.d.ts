/// <reference types="react" />
import { ObjectNode, DefaultNodeOptions } from 'headless-json-editor';
import { SemanticCOLORS } from 'semantic-ui-react';
import { ObjectLayout } from './buildObjectLayout';
import { WidgetPlugin } from '../decorators';
import { WidgetModalSize } from '../../components/widgetmodal/WidgetModal';
export declare type ObjectOptions = {
    /** additional classnames for object editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: WidgetModalSize;
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /**
     * Arrange properties within a 16 columns grid.
     * Format: `[{ prop: "title", width: 8 }, ...]`. Use `{ prop: '*', width: 16 }` to reference remaining properties
     */
    layout?: ObjectLayout & {
        type?: 'default' | 'card';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;
export declare const ObjectWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<ObjectNode<ObjectOptions>>) => JSX.Element | null>;
export declare const ObjectWidgetPlugin: WidgetPlugin;
