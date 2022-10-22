import { ComponentStory } from '@storybook/react';
import { defaultWidgets, useJsonEditor } from '../../../index';
import { FileWidget } from './FileWidget';
import { RemoteEnumOptionsPlugin, get, StringNode } from 'headless-json-editor';
import { Form } from 'semantic-ui-react';
import '../../styles.scss';

export default {
    title: 'Widget/FileWidget',
    component: FileWidget,
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } }
    }
};

const Template: ComponentStory<any> = ({ data, schema }) => {
    const [node, instance] = useJsonEditor({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });

    const fileNode = get(node, '/file') as StringNode;

    return (
        <Form error>
            <FileWidget node={fileNode} instance={instance} />
        </Form>
    );
};

export const SingleFileFilename = Template.bind({});
SingleFileFilename.args = {
    data: {
        file: 'given filename'
    },
    schema: {
        type: 'object',
        properties: {
            file: {
                title: 'File',
                type: ['string', 'object'],
                format: 'file',
                options: {}
            }
        }
    }
};

export const SingleFileEmpty = Template.bind({});
SingleFileEmpty.args = {
    data: {
        file: ''
    },
    schema: {
        type: 'object',
        properties: {
            file: {
                title: 'File',
                type: ['string', 'object'],
                format: 'file',
                options: {}
            }
        }
    }
};
