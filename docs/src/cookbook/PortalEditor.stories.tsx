import { createContext, use } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Editor, useEditor, Widget, widget } from '@sagold/react-json-editor';
import widgets from '@sagold/rje-mantine-widgets';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';

const meta: Meta<typeof DataPortalPoc> = {
    title: 'Cookbook/DataPortal',
    component: DataPortalPoc,
    decorators: [MantineThemeDecorator]
};

const PortalContext = createContext<{
    editors: { [k: string]: Editor | null };
    get: (id: string) => Editor | null;
}>({
    editors: {},
    get(id: string) {
        return this.editors[id] ?? null;
    }
});

const PortalWidget = widget(({ node }) => {
    const nestedEditor = use(PortalContext).get(node.schema['x-portal']);

    return <Widget editor={nestedEditor} node={nestedEditor?.getNode()} />;
});

export default meta;
type Story = StoryObj<typeof DataPortalPoc>;

function DataPortalPoc() {
    const nestedEditor = useEditor({
        widgets,
        onChange: (data) => console.log('nested', data),
        schema: {
            title: 'Nested Json-Editor',
            type: 'object',
            required: ['width', 'height'],
            properties: {
                width: { type: 'number' },
                height: { type: 'number' }
            }
        }
    });

    const editor = useEditor({
        onChange: (data) => console.log('main', data),
        data: {
            options: {
                portal: null
            }
        },
        widgets: [
            {
                id: 'portal',
                use: (node) => node.schema['x-portal'],
                Widget: PortalWidget
            },
            ...widgets
        ],
        schema: {
            title: 'Json-Editor',
            description: `A json-editor returns a data matching the given JSON schema.
            Building complex web forms it might be necessary to work on muliple data sources within one web form.
            This example demonstrates **how two json-editors might be combined**:

            - Note that hiding and showing the nested editor will not destroy its data as it is tracked in a separate state
            - Note that the nested editor still requires a present data value - here we use 'portal: null' to reference the DataPortalWidget
            `,
            $schema: 'draft-2020-12',
            type: 'object',
            required: ['options'],
            properties: {
                options: {
                    required: ['title'],
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string'
                        },
                        portal: {
                            type: 'null',
                            'x-portal': 'nested'
                        }
                    }
                }
            }
        }
    });

    return (
        <div className="rje-form">
            <PortalContext value={{ editors: { nested: nestedEditor }, get: (id) => nestedEditor }}>
                <Widget editor={editor} node={editor?.getNode()} />
            </PortalContext>
        </div>
    );
}

export const DataPortal: Story = {};
