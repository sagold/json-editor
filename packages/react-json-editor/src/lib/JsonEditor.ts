import { ErrorWidget } from './components/ErrorWidget';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions, Node, isNode } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './decorators';

let defaultWidgets: WidgetPlugin[] = [];
export function setDefaultWidgets(widgets: WidgetPlugin[]) {
    defaultWidgets = widgets;
}

export type JsonEditorOptions = HeadlessJsonEditorOptions & {
    widgets?: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if true disables all editors */
    disabled?: boolean;
};

export class JsonEditor extends HeadlessJsonEditor {
    widgets: WidgetPlugin[];
    widgetOptions: {
        /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
        liveUpdate?: boolean;
        /** if true disables all editors */
        disabled?: boolean;
    } = {};

    constructor(options: JsonEditorOptions) {
        super(options);
        if (typeof options?.liveUpdate === 'boolean') {
            this.widgetOptions.liveUpdate = options.liveUpdate;
        }
        if (typeof options?.disabled === 'boolean') {
            this.widgetOptions.disabled = options.disabled;
        }
        this.widgets = Array.isArray(options?.widgets) ? options.widgets : defaultWidgets;
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
