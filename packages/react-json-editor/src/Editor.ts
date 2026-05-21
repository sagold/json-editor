import { ErrorWidget } from './components/ErrorWidget';
import { HeadlessEditor, HeadlessEditorOptions, type JsonNode, isJsonNode } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './decorators';

let defaultWidgets: WidgetPlugin[] = [];
export function setDefaultWidgets(widgets: WidgetPlugin[]) {
    defaultWidgets = widgets;
}

export type EditorOptions<Data = unknown> = HeadlessEditorOptions<Data> & {
    widgets?: WidgetPlugin[];
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if true disables all editors */
    disabled?: boolean;
};

export class Editor<Data = unknown> extends HeadlessEditor<Data> {
    widgets: WidgetPlugin[];
    widgetOptions: {
        /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
        liveUpdate?: boolean;
        /** if true disables all editors */
        disabled?: boolean;
    } = {};

    constructor(options: EditorOptions<Data>) {
        super(options);
        if (typeof options?.liveUpdate === 'boolean') {
            this.widgetOptions.liveUpdate = options.liveUpdate;
        }
        if (typeof options?.disabled === 'boolean') {
            this.widgetOptions.disabled = options.disabled;
        }
        this.widgets = Array.isArray(options?.widgets) ? options.widgets : defaultWidgets;
    }

    /**
     * Use `editor.getWidget` to find a widget matching the requested `JsonNode`
     *
     * @param node - is a JsonNode belonging to the root JsonNode of this editor, or the root itself. You can get the root by calling `editor.getNode()` or any nested root by specifying a JSON Pointer to the data `editor.getNode("#/header/title")`;
     * @param options - can be passed to the lookup function, which will be available in a WidgetPlugin's use-function: `use(node, options) => boolean`. Usually, options are passed to getWidget as well as to the widget itself
     * @returns The **Widget component** to render the given node or undefined
     */
    getWidget<T extends JsonNode['options'] = JsonNode['options']>(node: JsonNode, options?: T): Widget {
        if (!isJsonNode(node)) {
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
