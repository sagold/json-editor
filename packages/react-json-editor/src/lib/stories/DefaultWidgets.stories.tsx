import { ComponentStory } from '@storybook/react';
import { JsonForm, useEditor } from '../../index';
import { data, schema } from './data/features';
import { useEffect, useState } from 'react';
// import '../styles.scss';

export default {
    title: 'Example',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    const editor = useEditor();
    const [editorData, setEditorData] = useState(data);

    useEffect(() => {
        // @ts-ignore
        window.changeData = () => setEditorData({ text: 'mimimi' });
    }, [data]);

    return (
        <JsonForm
            ref={editor}
            data={editorData}
            schema={schema}
            validate={true}
            liveUpdate={true}
            onChange={(data) => {
                // console.log('change data in editor');
                // setEditorData({ text: 'mimimi' });
            }}
        />
    );
};

export const DefaultWidgets = Template.bind({});
