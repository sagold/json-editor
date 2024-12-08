import { ComponentStory } from '@storybook/react';
import { useEditor, RemoteEnumOptionsPlugin, ParentNode } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { MasterDetailWidget } from './MasterDetailWidget';
import { Theme } from '../../components/theme/Theme';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'packages/rje-aria-widgets/MasterDetailWidget',
    component: MasterDetailWidget,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, editor] = useEditor<ParentNode>({
        schema,
        widgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });
    return (
        <Theme style={{ width: 400 }}>
            <MasterDetailWidget node={node} editor={editor} options={{ header: { inverted: true } }} />
        </Theme>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const List = Template.bind({});
List.args = {
    data: [
        { title: 'first value', value: 1 },
        { title: 'wrong value type', value: 'four' }
    ],
    schema: {
        title: 'Contents',
        description: 'MasterDetailWidget will delegates child widgets to a modal window',
        type: 'array',
        options: {
            descriptionInline: true,
            sortable: {
                enabled: true
            }
        },
        items: {
            title: 'content item',
            type: 'object',
            options: {
                previewValue: 'title'
            },
            properties: {
                title: { type: 'string' },
                value: { type: 'number', minimum: 1 }
            }
        }
    }
};
