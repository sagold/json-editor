import { ComponentStory } from '@storybook/react';
import { JsonFormProps, useJsonEditor } from '../../index';
import { data, schema } from './data/features';
import '../styles.scss';
import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin } from 'headless-json-editor';

function SideBySide({ schema, data, onChange }: JsonFormProps) {
    const [node, instance] = useJsonEditor({ schema, onChange, plugins: [RemoteEnumOptionsPlugin], data });
    if (node == null) {
        return <></>;
    }
    const ChildEditor = instance.getEditor(node);
    return (
        <section id="side-by-side">
            <Form error style={{ paddingRight: '24px' }}>
                <ChildEditor node={node} instance={instance} />
            </Form>
            <Form error>
                <ChildEditor node={node} instance={instance} />
            </Form>
        </section>
    );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example',
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
            <SideBySide
                schema={schema}
                data={data}
                onChange={(data, root) => {
                    console.log('on change', root);
                }}
            />
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const DefaultEditors = Template.bind({});