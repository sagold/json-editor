import { ComponentStory, ComponentMeta } from '@storybook/react';
import { JsonEditor, JsonEditorProps } from './components/jsoneditor';
import { data, schema } from './data/features';
import './styles.scss';
import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin, JSONSchema, json } from '@sagold/headless-json-editor';
import { useJsonEditor } from './useJsonEditor';

function SideBySide({ schema, data, onChange }: JsonEditorProps) {
    const [node, getEditor, instance] = useJsonEditor({ schema, onChange, plugins: [RemoteEnumOptionsPlugin], data });
    if (node == null) {
        return <></>;
    }
    const ChildEditor = getEditor(node);
    return (
        <section id="side-by-side">
            <Form error style={{ paddingRight: '24px' }}>
                <ChildEditor node={node} instance={instance} getEditor={getEditor} />
            </Form>
            <Form error>
                <ChildEditor node={node} instance={instance} getEditor={getEditor} />
            </Form>
        </section>
    );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Demos',
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    return (
        <div>
            <p>The following is the same editor rendered twice to test update mechanism</p>
            <SideBySide schema={schema} data={data} onChange={() => console.log('change')} />
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const EditorsOverview = Template.bind({});
