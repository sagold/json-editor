import { Node } from 'headless-json-editor';
import { JsonEditor } from '../../JsonEditor';
export declare type WidgetProps<T extends Node = Node> = {
    editor: JsonEditor;
    node: Node;
    options?: Partial<T['options']>;
};
export declare function Widget<T extends Node = Node>({ editor, node, options }: WidgetProps<T>): JSX.Element;
