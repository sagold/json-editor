import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEditor } from '@sagold/react-json-editor';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { SelectionProvider } from '@sagold/rje-mantine-widgets';
import { useState } from 'react';

const meta: Meta<typeof SelectForDetailsComponent> = {
    title: 'Cookbook/SelectForDetails',
    component: SelectForDetailsComponent,
    decorators: [MantineThemeDecorator]
};

export default meta;
type Story = StoryObj<typeof SelectForDetailsComponent>;

function SelectForDetailsComponent() {
    const [selected, setSelected] = useState<string | undefined>();
    const editor = useEditor({
        onChange: (data) => console.log(data),
        data: [{ type: 'image' }, { type: 'paragraph' }],
        schema: {
            $schema: 'draft-2020-12',
            type: 'array',
            title: 'Select For Details',
            items: {
                oneOfProperty: 'type',
                oneOf: [
                    {
                        title: 'Image',
                        type: 'object',
                        options: { selectable: true, hideChildren: true },
                        required: ['type', 'url', 'width', 'height', 'altText'],
                        properties: {
                            type: { const: 'image', options: { hidden: true } },
                            url: { type: 'string' },
                            width: { type: 'number' },
                            height: { type: 'number' },
                            altText: { type: 'string' }
                        }
                    },
                    {
                        title: 'Paragraph',
                        type: 'object',
                        options: { selectable: true, hideChildren: true },
                        required: ['type', 'title', 'text'],
                        properties: {
                            type: { const: 'paragraph', options: { hidden: true } },
                            title: { type: 'string' },
                            text: { type: 'string', format: 'textarea' }
                        }
                    }
                ]
            }
        }
    });

    if (editor == null) {
        return null;
    }

    const rootNode = editor.getNode();
    const RootWidget = editor?.getWidget(editor.getNode());

    let Details;
    let detailsNode;
    if (selected) {
        detailsNode = editor.getNode(selected);
        Details = editor.getWidget(detailsNode);
    }

    return (
        <div className="rje-form">
            <style>
                {`
                .rje-form {
                    display: flex;
                    gap: 1em;
                }`}
            </style>
            <SelectionProvider onSelect={setSelected}>
                <RootWidget editor={editor} node={rootNode} />
            </SelectionProvider>
            <div className="sidebar" style={{ flexGrow: 1, minWidth: '20em' }}>
                {selected ? <Details editor={editor} node={detailsNode} options={{ hideChildren: false }} /> : null}
            </div>
        </div>
    );
}

export const SelectForDetails: Story = {};
