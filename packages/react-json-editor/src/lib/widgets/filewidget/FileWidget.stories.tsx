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
    const [node, editor] = useJsonEditor({
        schema,
        widgets: defaultWidgets,
        plugins: [RemoteEnumOptionsPlugin],
        data,
        validate: true
    });

    const fileNode = get(node, '/file') as StringNode;

    return (
        <Form error>
            <FileWidget node={fileNode} editor={editor} />
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
                options: {},
                minLength: 1
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

export const ImagePreviewUrl = Template.bind({});
ImagePreviewUrl.args = {
    data: {
        file: 'photo-1666410025931-96796794c5e2'
    },
    schema: {
        type: 'object',
        properties: {
            file: {
                title: 'File',
                type: ['string', 'object'],
                format: 'file',
                options: {
                    imageUrlTemplate:
                        'https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60'
                }
            }
        }
    }
};

export const DownloadUrl = Template.bind({});
DownloadUrl.args = {
    data: {
        file: 'photo-1666410025931-96796794c5e2'
    },
    schema: {
        type: 'object',
        properties: {
            file: {
                title: 'File',
                type: ['string', 'object'],
                format: 'file',
                options: {
                    downloadUrlTemplate:
                        'https://images.unsplash.com/{{value}}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60'
                }
            }
        }
    }
};
