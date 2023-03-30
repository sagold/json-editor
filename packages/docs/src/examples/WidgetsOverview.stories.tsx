import { ComponentStory } from '@storybook/react';
import { data, schema } from './data/features';
import { errors, json } from 'headless-json-editor';
import { JsonForm, JsonEditor } from '@sagold/react-json-editor';
import { useEffect, useRef, useState } from 'react';
import { widgets } from '@sagold/rje-widgets';
import theme from '../../../rje-widgets/src/lib/theme';

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
        <JsonForm
            classNames="rje-form rje-theme--light"
            style={theme}
            widgets={widgets}
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
    );
};

export const DefaultWidgets = Template.bind({});
