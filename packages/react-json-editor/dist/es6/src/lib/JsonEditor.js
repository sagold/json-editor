import { ErrorWidget } from './widgets/ErrorWidget';
import { HeadlessJsonEditor, isNode } from 'headless-json-editor';
export class JsonEditor extends HeadlessJsonEditor {
    constructor(options) {
        super(options);
        /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
        this.widgetOptions = {};
        this.widgetOptions.liveUpdate = options.liveUpdate;
        this.widgets = options.widgets;
    }
    getWidget(node, options) {
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
//# sourceMappingURL=JsonEditor.js.map