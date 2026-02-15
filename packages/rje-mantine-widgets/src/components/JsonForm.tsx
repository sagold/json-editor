import classNames from 'classnames';
import { Editor, useEditor, UseEditorOptions } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../widgets';
import { useImperativeHandle, useMemo } from 'react';

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
    const rootNode = instance?.getNode();
    const Widget = useMemo(() => (instance && rootNode ? instance.getWidget(rootNode) : null), [instance, rootNode]);

    useImperativeHandle<Editor<Data> | null, Editor<Data> | null>(editor, () => instance, [instance]);
    if (instance == null || Widget == null || rootNode == null) {
        return <div className={classNames('rje-form', className)} style={style} />;
    }
    return (
        <div className={classNames('rje-form', className)} style={style}>
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Widget node={rootNode} editor={instance} />
        </div>
    );
}
