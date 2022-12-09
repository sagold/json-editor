import { Node } from 'headless-json-editor';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './widgets/decorators';
export declare type JsonEditorOptions = HeadlessJsonEditorOptions & {
    widgets: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
};
export declare class JsonEditor extends HeadlessJsonEditor {
    widgets: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    widgetOptions: {
        liveUpdate?: boolean;
    };
    constructor(options: JsonEditorOptions);
    getWidget(node: Node, options?: Record<string, unknown>): Widget;
}
