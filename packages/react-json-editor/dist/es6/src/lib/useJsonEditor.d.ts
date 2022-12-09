import { HeadlessJsonEditorOptions, Plugin, Node, OnChangeListener, JSONSchema } from 'headless-json-editor';
import { JsonEditor } from './JsonEditor';
import { WidgetPlugin } from './widgets/decorators';
export declare type UseJsonEditorOptions = {
    widgets: WidgetPlugin[];
    schema: JSONSchema;
    data?: unknown;
    validate?: boolean;
    draftConfig?: HeadlessJsonEditorOptions['draftConfig'];
    onChange?: OnChangeListener;
    plugins?: Plugin[];
    cacheKey?: string | number;
    liveUpdate?: boolean;
};
/**
 * add json editor widget capabilities to your functional component
 */
export declare function useJsonEditor<T extends Node = Node>(settings: UseJsonEditorOptions): [T, JsonEditor];
