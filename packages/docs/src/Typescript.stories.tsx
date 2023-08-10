import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useState } from 'react';
import { JsonForm } from '../../react-json-editor/src/lib/components/jsonform';
import { JsonEditor } from '../../react-json-editor/src/lib/JsonEditor';
import { Theme } from '../../rje-widgets/src/lib/components/theme/Theme';
import { useJsonEditor } from '../../react-json-editor/src/lib/useJsonEditor';
import { JsonSchema } from 'headless-json-editor';

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
    const [node, editor] = useJsonEditor<MyData>({
        schema: jsonSchema,
        // (data: MyData) => void
        onChange(data) {}
    });

    // data: MyData
    const data = editor.getData();

    return <div />;
}

function TypedJsonForm() {
    const [editor, setEditor] = useState<JsonEditor<MyData>>();

    // data: MyData
    const data = editor?.getData();

    return (
        <Theme>
            <JsonForm<MyData>
                // (editor: JsonEditor<MyData>) => void)
                editor={setEditor}
                // (data: MyData) => void
                onChange={(data) => {}}
                schema={jsonSchema}
            />
        </Theme>
    );
}
