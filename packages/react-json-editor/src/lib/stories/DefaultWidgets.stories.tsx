import { ComponentStory } from '@storybook/react';
import { JsonForm, JsonEditor } from '../../index';
import { data, schema } from './data/features';
import { useEffect, useRef, useState } from 'react';
import { errors, json } from 'headless-json-editor';

export default {
    title: 'Example',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
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
