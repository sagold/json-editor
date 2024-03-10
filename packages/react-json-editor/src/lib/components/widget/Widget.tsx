import { Node } from 'headless-json-editor';
import { Editor } from '../../Editor';
import { WidgetField, WidgetFieldProps } from './WidgetField';
import { WidgetDescription, WidgetDescriptionProps } from './WidgetDescription';
import { WidgetError, WidgetErrorProps } from './WidgetError';

Widget.Field = WidgetField;
Widget.Description = WidgetDescription;
Widget.Error = WidgetError;

export type WidgetProps<T extends Node = Node> = {
    editor: Editor;
    node: Node;
    options?: Partial<T['options']>;
};

export function Widget<T extends Node = Node>({ editor, node, options }: WidgetProps<T>) {
    const ChildEditor = editor.getWidget(node, options);
    return <ChildEditor editor={editor} node={node} options={options} />;
}

export type { WidgetFieldProps, WidgetDescriptionProps, WidgetErrorProps };
