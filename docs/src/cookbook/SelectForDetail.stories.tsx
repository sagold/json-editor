import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEditor } from '@sagold/react-json-editor';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { SelectionProvider } from '@sagold/rje-mantine-widgets';
import { useState, useMemo } from 'react';

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

    const rootNode = editor?.getNode();
    const RootWidget = useMemo(() => (editor && rootNode ? editor.getWidget(rootNode) : null), [editor, rootNode]);

    const detailsNode = selected && editor ? editor.getNode(selected) : undefined;
    const Details = useMemo(() => (detailsNode && editor ? editor.getWidget(detailsNode) : null), [editor, detailsNode]);

    if (editor == null || RootWidget == null) {
        return null;
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
                {/* eslint-disable-next-line react-hooks/static-components */}
                <RootWidget editor={editor} node={rootNode} />
            </SelectionProvider>
            <div className="sidebar" style={{ flexGrow: 1, minWidth: '20em' }}>
                {/* eslint-disable-next-line react-hooks/static-components */}
                {selected && Details ? <Details editor={editor} node={detailsNode} options={{ hideChildren: false }} /> : null}
            </div>
        </div>
    );
}

export const SelectForDetails: Story = {};
