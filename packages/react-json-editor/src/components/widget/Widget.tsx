import { DataNode } from 'headless-json-editor';
import { Editor } from '../../Editor';
import { WidgetField, WidgetFieldProps } from './WidgetField';
import { WidgetDescription, WidgetDescriptionProps } from './WidgetDescription';
import { WidgetError, WidgetErrorProps } from './WidgetError';
import { useMemo } from 'react';

Widget.Field = WidgetField;
Widget.Description = WidgetDescription;
Widget.Error = WidgetError;

export type WidgetProps<T extends DataNode = DataNode> = {
    editor: Editor | null;
    node?: DataNode;
    options?: Partial<T['options']>;
};

export function Widget<T extends DataNode = DataNode>({ editor, node, options }: WidgetProps<T>) {
    const state = node ?? editor?.getNode();
    const ChildEditor = useMemo(() => (editor && state ? editor.getWidget(state, options) : null), [editor, state, options]);

    if (editor == null || ChildEditor == null || state == null) {
        return null;
    }
    // eslint-disable-next-line react-hooks/static-components
    return <ChildEditor editor={editor} node={state} options={options} />;
}

export type { WidgetFieldProps, WidgetDescriptionProps, WidgetErrorProps };
