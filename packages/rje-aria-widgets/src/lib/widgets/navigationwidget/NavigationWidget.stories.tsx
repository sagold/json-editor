import { ComponentStory } from '@storybook/react';
import { useEditor, RemoteEnumOptionsPlugin, ParentNode } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { NavigationWidget } from './NavigationWidget';
import { Theme } from '../../components/theme/Theme';

const schema = {
    type: 'object',
    properties: {
        title: {
            title: 'Title',
            type: 'string'
        },
        contents: {
            title: 'Contents',
            type: 'array',
            options: {
                sortable: {
                    enabled: true
                }
            },
            items: {
                title: 'content item',
                type: 'string'
            }
        },
        details: {
            title: 'Details',
            type: 'object',
            properties: {
                editor: {
                    type: 'string'
                }
            }
        }
    }
};

const data = {
    title: 'content title',
    contents: ['1', 'four'],
    details: {
        editor: 'asdasd'
    }
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'packages/rje-aria-widgets/NavigationWidget',
    component: NavigationWidget,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema, options }) => {
    console.log('COMP', options);
    const [node, editor] = useEditor<ParentNode>({
        schema,
        widgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });
    return (
        <Theme style={{ width: '400px' }}>
            <NavigationWidget node={node} editor={editor} options={options} />
        </Theme>
    );
};

export const Default = Template.bind({ data, schema });

export const ShowProperties = Template.bind({});
ShowProperties.args = {
    options: {
        showProperties: true
    }
};
