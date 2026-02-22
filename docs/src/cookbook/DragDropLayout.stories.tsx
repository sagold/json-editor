import { JsonForm, Editor, useDraggableTemplates } from '@sagold/rje-mantine-widgets';
import { Meta, StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { useRef, useState } from 'react';
import { JsonSchema } from 'headless-json-editor';

// prevent slide back animation
document.addEventListener('dragover', function (e) {
    e.preventDefault();
});

const schema: JsonSchema = {
    $schema: 'draft-2020-12',
    title: 'Layout and Components',
    description: 'Creates a one and two column layout containing components. Components can be moved across columns',
    type: 'array',
    options: {
        sortable: {
            enabled: true,
            group: 'groups'
        }
    },
    items: {
        oneOfProperty: 'type',
        oneOf: [{ $ref: '#/$defs/one-column' }, { $ref: '#/$defs/two-columns' }]
    },
    $defs: {
        'one-column': {
            title: 'column',
            type: 'object',
            required: ['type', 'children'],
            options: { showTitle: false },
            properties: {
                type: { const: 'one-column', options: { hidden: true } },
                children: {
                    options: {
                        showTitle: false,
                        showHeaderMenu: false,
                        sortable: {
                            enabled: true,
                            group: 'components'
                        }
                    },
                    type: 'array',
                    items: {
                        oneOfProperty: 'type',
                        oneOf: [
                            { $ref: '#/$defs/component:paragraph' },
                            { $ref: '#/$defs/component:header' },
                            { $ref: '#/$defs/component:image' }
                        ]
                    }
                }
            }
        },
        'two-columns': {
            title: 'two columns',
            type: 'object',
            required: ['type', 'children'],
            options: { showTitle: false },
            properties: {
                type: { const: 'two-columns', options: { hidden: true } },
                children: {
                    options: { showHeader: false, classNames: ['layout__two-columns'] },
                    type: 'array',
                    minItems: 2,
                    maxItems: 2,
                    prefixItems: [
                        { $ref: '#/$defs/one-column', options: { showHeader: false } },
                        { $ref: '#/$defs/one-column', options: { showHeader: false } }
                    ]
                }
            }
        },
        'component:paragraph': {
            title: 'Paragraph',
            type: 'object',
            options: { classNames: ['layout__component'] },
            required: ['type'],
            properties: {
                type: { const: 'component:paragraph', options: { hidden: true } }
            }
        },
        'component:header': {
            title: 'Header',
            type: 'object',
            options: { classNames: ['layout__component'] },
            required: ['type'],
            properties: {
                type: { const: 'component:header', options: { hidden: true } }
            }
        },
        'component:image': {
            title: 'Image',
            type: 'object',
            options: { classNames: ['layout__component'] },
            required: ['type'],
            properties: {
                type: { const: 'component:image', options: { hidden: true } }
            }
        }
    }
};

function TemplateStory() {
    const ref = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<Editor>();
    useDraggableTemplates(ref, editor, '.template');
    return (
        <div id="dragndrop--template">
            <style>{`
            div.rje-form table {
                --table-striped-color: transparent;
            }

            .rje-form .rje-content--object.rje-content--with-header {
                padding-top: 0;
            }

            .rje-form .rje-widget__input-wrapper > label + div > .rje-object__properties,
            .rje-form .rje-widget__input-wrapper > label + div > .rje-array__items {
                margin-top: 0;
            }

            .layout__two-columns > div.rje-widget__input-wrapper > div > table > tbody {
                display: flex;
                & > tr {
                    border: none;
                    flex-grow: 1;
                    > td {
                        display: block;
                    }
                }
            }

            .rje-form .rje-array__inline-add button.mantine-UnstyledButton-root {
                background: steelblue;
                padding: .25em;
                color: #fff;
            }

            .layout__component {
                border: 1px solid #333;
                border-radius: 4px;
                background: #fff;

                .rje-widget__parent-header {
                    padding: .5em;
                    h4, h5, h6 {
                        font-size: 1em;
                    }
                }
            }
        `}</style>
            <div className="xxcolumns">
                <JsonForm
                    editor={(editor) => editor && setEditor(editor)}
                    schema={schema}
                    data={[
                        {
                            type: 'two-columns',
                            children: [
                                {
                                    type: 'one-column',
                                    children: [{ type: 'component:header' }, { type: 'component:paragraph' }]
                                },
                                { type: 'one-column', children: [{ type: 'component:image' }] }
                            ]
                        },
                        {
                            type: 'one-column',
                            children: [
                                {
                                    type: 'component:image'
                                }
                            ]
                        }
                    ]}
                    onChange={(data) => console.log(data)}
                />
            </div>
        </div>
    );
}

const meta: Meta<unknown> = {
    title: 'Cookbook/DragDropTemplate',
    component: TemplateStory,
    decorators: [MantineThemeDecorator]
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const DragDropLayout: StoryObj<typeof JsonForm> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    }
};
