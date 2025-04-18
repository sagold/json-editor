import classNames from 'classnames';
import { Editor, useEditor, UseEditorOptions } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../widgets';
import { useImperativeHandle } from 'react';

export function JsonForm<Data = unknown>({
    style,
    editor,
    theme,
    className,
    ...options
}: UseEditorOptions<Data> & {
    editor?: (editor: Editor<Data> | null) => void;
    /** custom styles applied for form element */
    style?: React.CSSProperties;
    /** custom css classNames to apply on root element */
    className?: string;
}) {
    const widgets = Array.isArray(options.widgets) ? options.widgets : defaultWidgets;
    const instance = useEditor<Data>({ ...options, widgets });
    useImperativeHandle<Editor<Data> | null, Editor<Data> | null>(editor, () => instance, [instance]);
    if (instance == null) {
        return <div className={classNames('rje-form', className)} style={style} />;
    }
    const rootNode = instance.getNode();
    const Widget = instance.getWidget(rootNode);
    return (
        <div className={classNames('rje-form', className)} style={style}>
            <Widget node={rootNode} editor={instance} />
        </div>
    );
}
