import { ErrorWidget } from './components/ErrorWidget';
import { HeadlessEditor, HeadlessEditorOptions, type JsonNode, isJsonNode } from 'headless-json-editor';
import { Widget, WidgetPlugin } from './decorators';

let defaultWidgets: WidgetPlugin[] = [];
/**
 * Register a list of widgets for all new editor instances per default
 *
 * @example
 *  import { setDefaultWidgets } from '@sagold/react-json-editor';
 *  import widgets from '@sagold/rje-mantine-widgets';
 *  setDefaultWidgets(widgets);
 */
export function setDefaultWidgets(widgets: WidgetPlugin[]) {
    defaultWidgets = widgets;
}

export type EditorOptions<Data = unknown> = HeadlessEditorOptions<Data> & {
    /** The list of available widgets to render the JSON Schema tree. Each node in the tree should have a matching widget to be rendered or the editor will either ignore or show an error using an Error Widget if added. */
    widgets?: WidgetPlugin[];
    /** Set to `true` to update form data on each keystroke instead of on blur. Only applied to supporting editors */
    liveUpdate?: boolean;
    /** Set to true to deactivate all forms */
    disabled?: boolean;
};

type WidgetOptions = {
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    /** if true disables all editors */
    disabled?: boolean;
};

/**
 * `new Editor` returns your editor-instance containing a JSON Schema tree, registered widgets and plugins and the overall state of the data.
 *
 * @example
 * import { Editor } from '@sagold/react-json-editor';
 *
 * const editor = new Editor(options);
 *
 * @caveat Each JSON Schema requires a valid JSON Schema type keyword
 *
 * @returns Returns an `editor` instance
 */
export class Editor<Data = unknown> extends HeadlessEditor<Data> {
    widgets: WidgetPlugin[];
    /* input options for this editor instance */
    widgetOptions: WidgetOptions = {};

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
