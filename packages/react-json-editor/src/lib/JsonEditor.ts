import { ErrorWidget } from './components/ErrorWidget';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions, Node, isNode } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './decorators';

export type JsonEditorOptions = HeadlessJsonEditorOptions & {
    widgets: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
};

export class JsonEditor extends HeadlessJsonEditor {
    widgets: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    widgetOptions: {
        liveUpdate?: boolean;
    } = {};

    constructor(options: JsonEditorOptions) {
        super(options);
        this.widgetOptions.liveUpdate = options.liveUpdate;
        this.widgets = options.widgets;
    }

    getWidget(node: Node, options?: Record<string, unknown>): Widget {
        if (!isNode(node)) {
            console.log('invalid node passed to getWidget', node);
            return ErrorWidget;
        }
        const { Widget } = this.widgets.find((ed) => ed.use(node, options)) || {};
        if (Widget) {
            return Widget;
        }
        throw new Error(`Failed retrieving an editor for '${node.pointer}'`);
    }
}
