import { ComponentStory } from '@storybook/react';
import { defaultEditors, useJsonEditor } from '../../../index';
import { TableEditor } from './TableEditor';
import { RemoteEnumOptionsPlugin } from 'headless-json-editor';
import '../../styles.scss';

export default {
    title: 'Editor/TableEditor',
    component: TableEditor,
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, instance] = useJsonEditor({
        schema,
        editors: defaultEditors,
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
            <TableEditor
                node={node}
                instance={instance}
                // options={{ withChildren: true }}
            />
        </div>
    );
};

export const List = Template.bind({});
List.args = {
    data: [
        { title: 'first value', value: 1 },
        { title: 'wrong value type', value: 'four' },
        { title: 'large number', value: 10009919291923 },
        { title: 'empty' }
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
