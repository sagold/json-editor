import classNames from 'classnames';
import { Editor, useEditor, UseEditorOptions } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../../index';

export function JsonForm<Data = unknown>({ style, editor, theme, ...options }: UseEditorOptions<Data> & {
    editor?: (editor: Editor<Data>) => void;
    /** custom styles applied for form element */
    style?: React.CSSProperties;
    theme?: "dark" | "light"
}) {
    const widgets = Array.isArray(options.widgets) ? options.widgets : defaultWidgets;
    const [root, instance] = useEditor({
        ...options,
        widgets
    });
    const Widget = instance.getWidget(root);
    return <div className={classNames("rje-form", theme && `rje-theme rje-theme--${theme}`)} style={style}>
        <Widget node={root} editor={instance} />
    </div>
}
