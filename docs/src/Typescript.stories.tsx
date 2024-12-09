import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema } from 'headless-json-editor';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { useEditor, Editor } from '@sagold/react-json-editor';
import { MantineThemeDecorator } from './decorators/MantineThemeDecorator';

type Story = StoryObj<typeof TypedJsonForm>;
const meta: Meta<typeof TypedJsonForm> = {
    title: 'docs/Typescript',
    component: TypedJsonForm,
    decorators: [MantineThemeDecorator]
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

    return <JsonForm<MyData> editor={setEditor} onChange={(data) => {}} schema={jsonSchema} />;
}
