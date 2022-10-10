import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { MasterDetailWidget } from './MasterDetailWidget';
import { RemoteEnumOptionsPlugin, ParentNode } from 'headless-json-editor';
import '../../styles.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Editor/MasterDetailEditor',
    component: MasterDetailWidget,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, instance] = useJsonEditor<ParentNode>({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data
    });
    if (node == null) {
        return <></>;
    }
    // @ts-ignore
    window['rootNode'] = node;
    instance.validate();

    return (
        <div style={{ width: '400px' }}>
            <MasterDetailWidget
                node={node}
                instance={instance}
                // options={{ withChildren: true }}
            />
        </div>
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
        type: 'array',
        options: {
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
