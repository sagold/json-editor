import type { Meta } from '@storybook/react-webpack5';
import { JsonSchema } from 'headless-json-editor';
import { JsonForm } from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from './decorators/MantineThemeDecorator';
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

function TypedJsonForm() {
    return <JsonForm<MyData> editor={setEditor} onChange={() => {}} schema={jsonSchema} />;
}

function setEditor() {
    // This is a demo component
}
