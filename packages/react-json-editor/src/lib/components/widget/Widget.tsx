import { Node } from 'headless-json-editor';
import { JsonEditor } from '../../JsonEditor';

export type WidgetProps<T extends Node = Node> = {
    editor: JsonEditor;
    node: Node;
    options?: Partial<T['options']>;
};

export function Widget<T extends Node = Node>({ editor, node, options }: WidgetProps<T>) {
    const ChildEditor = editor.getWidget(node, options);
    return <ChildEditor editor={editor} node={node} options={options} />;
}
