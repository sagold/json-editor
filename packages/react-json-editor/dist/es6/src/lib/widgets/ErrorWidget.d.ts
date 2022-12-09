import { WidgetPlugin } from './decorators';
import { Node, HeadlessJsonEditor } from 'headless-json-editor';
export declare const ErrorWidget: ({ node, editor }: {
    node: Node;
    editor: HeadlessJsonEditor;
}) => JSX.Element;
export declare const ErrorWidgetPlugin: WidgetPlugin;
