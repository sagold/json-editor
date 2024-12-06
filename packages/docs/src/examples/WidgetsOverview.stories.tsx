import React from 'react';
import { ComponentStory } from '@storybook/react';
import { data, schema } from './data/features';
import { JsonSchema, errors, json } from 'headless-json-editor';
import { Editor } from '@sagold/react-json-editor';
import { useEffect, useState } from 'react';
import { widgets, JsonForm } from '@sagold/rje-widgets';
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
};

export const DefaultWidgets = Template.bind({});
