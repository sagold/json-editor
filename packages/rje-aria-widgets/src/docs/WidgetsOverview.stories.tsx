import { useEffect, useState } from 'react';
import { data, schema } from './data/features';
import { JsonSchema } from 'headless-json-editor';
import { Editor } from '@sagold/react-json-editor';
import { widgets, JsonForm, Theme } from '@sagold/rje-aria-widgets';
import { JsonWidgetPlugin } from '@sagold/rje-code-widgets';

export default {
    title: 'packages/rje-aria-widgets/examples/WidgetsOverview'
};

function Template() {
    const [editor, setEditor] = useState<Editor>();
    const [editorData, setEditorData] = useState(data);
    useEffect(() => {
        // @ts-ignore
        window.changeData = () => setEditorData({ text: 'mimimi' });
        // @ts-ignore
        window.getErrors = () => errors(editor?.getNode());
        // @ts-ignore
        window.getData = () => json(editor?.getNode());
        // @ts-ignore
        window.getState = () => editor?.getNode();
    }, [editor, data]);

    console.log('errors', editor?.getErrors());
    // @ts-ignore
    window.editor = editor;

    return (
        <Theme>
            <JsonForm
                widgets={[JsonWidgetPlugin, ...widgets]}
                editor={setEditor}
                data={editorData}
                schema={schema as JsonSchema}
                validate={true}
                liveUpdate={true}
            />
        </Theme>
    );
}

export const DefaultWidgets = Template.bind({});
