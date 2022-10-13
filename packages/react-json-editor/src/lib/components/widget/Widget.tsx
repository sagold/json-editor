import { Node } from 'headless-json-editor';
import { JsonEditor } from '../../JsonEditor';

export type WidgetProps<T extends Node = Node> = {
    instance: JsonEditor;
    node: Node;
    options?: Partial<T['options']>;
};

export function Widget<T extends Node = Node>({ instance, node, options }: WidgetProps<T>) {
    const ChildEditor = instance.getWidget(node, options);
    return <ChildEditor instance={instance} node={node} options={options} />;
}
