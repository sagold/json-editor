import { ComponentStory } from '@storybook/react';
import { data, schema } from './data/features';
import { JsonSchema, errors, json } from 'headless-json-editor';
import { Editor, JsonForm } from '@sagold/react-json-editor';
import { useEffect, useState } from 'react';
import { widgets } from '@sagold/rje-widgets';
import { Theme } from '../../../rje-widgets/src/lib/components/theme/Theme';
import { JsonWidgetPlugin } from '@sagold/rje-code-widgets';

export default {
    title: 'Examples/Widgets'
};

const Template: ComponentStory<any> = () => {
    const [editor, setEditor] = useState<Editor>();
    const [editorData, setEditorData] = useState(data);
    useEffect(() => {
        // @ts-ignore
        window.changeData = () => setEditorData({ text: 'mimimi' });
        // @ts-ignore
        window.getErrors = () => errors(editor?.getState());
        // @ts-ignore
        window.getData = () => json(editor?.getState());
        // @ts-ignore
        window.getState = () => editor?.getState();
    }, [data]);

    return (
        <Theme>
            <JsonForm
                widgets={[JsonWidgetPlugin, ...widgets]}
                editor={setEditor}
                data={editorData}
                schema={schema as JsonSchema}
                validate={true}
                liveUpdate={true}
                onChange={(data) => {
                    // console.log('change data in editor', data);
                    // setEditorData({ text: 'mimimi' });
                }}
            />
        </Theme>
    );
};

export const DefaultWidgets = Template.bind({});
