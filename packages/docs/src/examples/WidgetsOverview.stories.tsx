import { ComponentStory } from '@storybook/react';
import { data, schema } from './data/features';
import { errors, json } from 'headless-json-editor';
import { JsonForm, JsonEditor } from '@sagold/react-json-editor';
import { useEffect, useRef, useState } from 'react';
import { widgets } from '@sagold/rje-widgets';
import { Theme } from '../../../rje-widgets/src/lib/components/theme/Theme';
import { JsonWidgetPlugin } from '@sagold/rje-code-widgets';

export default {
    title: 'Examples/Widgets'
};

const Template: ComponentStory<any> = () => {
    const editor = useRef<JsonEditor>(null);
    const [editorData, setEditorData] = useState(data);
    useEffect(() => {
        // @ts-ignore
        window.changeData = () => setEditorData({ text: 'mimimi' });
        // @ts-ignore
        window.getErrors = () => errors(editor.current?.getState());
        // @ts-ignore
        window.getData = () => json(editor.current?.getState());
        // @ts-ignore
        window.getState = () => editor.current?.getState();
    }, [data]);

    return (
        <Theme>
            <JsonForm
                widgets={[JsonWidgetPlugin, ...widgets]}
                ref={editor}
                data={editorData}
                schema={schema}
                validate={true}
                liveUpdate={true}
                onChange={(data) => {
                    // console.log('change data in editor', editor);
                    // setEditorData({ text: 'mimimi' });
                }}
            />
        </Theme>
    );
};

export const DefaultWidgets = Template.bind({});
