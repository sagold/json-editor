import classNames from 'classnames';
import { Editor, useEditor, UseEditorOptions } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../../index';
import { useImperativeHandle } from 'react';

export function JsonForm<Data = unknown>({ style, editor, theme, className, ...options }: UseEditorOptions<Data> & {
    editor?: (editor: Editor<Data>) => void;
    theme?: "dark" | "light"
    /** custom styles applied for form element */
    style?: React.CSSProperties;
    /** custom css classNames to apply on root element */
    className?: string;
}) {
    const widgets = Array.isArray(options.widgets) ? options.widgets : defaultWidgets;
    const [root, instance] = useEditor<Data>({
        ...options,
        widgets
    });
    useImperativeHandle(editor, () => instance);
    const Widget = instance.getWidget(root);
    return <div className={classNames("rje-form", theme && `rje-theme rje-theme--${theme}`, className)} style={style}>
        <Widget node={root} editor={instance} />
    </div>
}
