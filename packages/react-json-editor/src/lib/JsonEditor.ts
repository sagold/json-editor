import { Node } from 'headless-json-editor';
import { ErrorWidget } from './widgets/ErrorWidget';
import { HeadlessJsonEditor, HeadlessJsonEditorOptions, isNode } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './widgets/decorators';

export type JsonEditorOptions = HeadlessJsonEditorOptions & {
    widgets: WidgetPlugin[];
};

export class JsonEditor extends HeadlessJsonEditor {
    widgets: WidgetPlugin[];

    constructor(options: JsonEditorOptions) {
        super(options);
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
