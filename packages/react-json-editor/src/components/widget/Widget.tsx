import { JsonNode } from 'headless-json-editor';
import { Editor } from '../../Editor';
import { WidgetField, WidgetFieldProps } from './WidgetField';
import { WidgetDescription, WidgetDescriptionProps } from './WidgetDescription';
import { WidgetError, WidgetErrorProps } from './WidgetError';
import { useMemo } from 'react';

Widget.Field = WidgetField;
Widget.Description = WidgetDescription;
Widget.Error = WidgetError;

export type WidgetProps<T extends JsonNode = JsonNode> = {
    editor: Editor | null;
    node?: T;
    options?: Partial<T['options']>;
};

/**
 * Selects and renders a matching widget for the given JsonNode
 *
 * @example
 * import { useEditor, Widget } from '@sagold/react-json-editor';
 *
 * function WebFormComponent() {
 *   const editor = useEditor(options);
 *   const node = editor.getNode();
 *
 *   return <Widget node={node} editor={editor} options={options} />;
 * }
 *
 * @param props The widget props
 * @param props.editor  The editor instance controlling this widget
 * @param props.node    The JsonNode to render a widget for
 * @param props.options Optional overrides for the node's display options
 * @returns matching WidgetComponent from WidgetPlugins or null
 */
export function Widget<T extends JsonNode = JsonNode>(props: WidgetProps<T>) {
    const { editor, node, options } = props;
    const state = node ?? editor?.getNode();
    const ChildEditor = useMemo(
        () => (editor && state ? editor.getWidget(state, options) : null),
        [editor, state, options]
    );

    if (editor == null || ChildEditor == null || state == null) {
        return null;
    }
    // eslint-disable-next-line react-hooks/static-components
    return <ChildEditor editor={editor} node={state} options={options} />;
}

export type { WidgetFieldProps, WidgetDescriptionProps, WidgetErrorProps };
