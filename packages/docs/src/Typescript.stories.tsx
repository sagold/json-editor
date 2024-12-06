import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '../../rje-widgets/src/lib/components/theme/Theme';
import { JsonSchema } from 'headless-json-editor';
import { JsonForm } from '@sagold/rje-widgets';
import { useEditor, Editor } from '@sagold/react-json-editor';

type Story = StoryObj<typeof TypedJsonForm>;
const meta: Meta<typeof TypedJsonForm> = {
  component: TypedJsonForm
};
export default meta;

const jsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    subTitle: { type: 'string' }
  }
};

type MyData = {
  title: string;
  subTitle: string;
};

function TypedUseJsonEditor() {
  // [Node, JsonEditor<MyData>]
  const [node, editor] = useEditor<MyData>({
    schema: jsonSchema,
    // (data: MyData) => void
    onChange(data) {}
  });

  // data: MyData
  const data = editor.getData();

  return <div />;
}

function TypedJsonForm() {
  const [editor, setEditor] = useState<Editor<MyData>>();

  // data: MyData
  const data = editor?.getData();

  return (
    <Theme>
      <JsonForm<MyData> editor={setEditor} onChange={(data) => {}} schema={jsonSchema} />
    </Theme>
  );
}
