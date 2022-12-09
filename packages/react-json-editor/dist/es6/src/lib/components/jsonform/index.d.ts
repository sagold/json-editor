/// <reference types="react" />
import { JSONSchema, Node, Plugin, DefaultNodeOptions, HeadlessJsonEditorOptions } from 'headless-json-editor';
import { WidgetPlugin } from '../../widgets/decorators';
import { JsonEditor } from '../../JsonEditor';
export declare type JsonFormProps = {
    schema: JSONSchema;
    data?: unknown;
    pointer?: string;
    widgets?: WidgetPlugin[];
    plugins?: Plugin[];
    cacheKey?: string | number;
    draft?: HeadlessJsonEditorOptions['draftConfig'];
    /** optional root node options */
    options?: Partial<DefaultNodeOptions> & Record<string, unknown>;
    onChange?: (data: unknown, root: Node) => void;
    /** set to true to initially validate complete data */
    validate?: boolean;
    /** if all supporting editors should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
};
export declare const JsonForm: import("react").ForwardRefExoticComponent<JsonFormProps & import("react").RefAttributes<JsonEditor>>;
