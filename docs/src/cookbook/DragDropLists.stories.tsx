import { JsonForm } from '@sagold/rje-mantine-widgets';
import { Meta, StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';

const meta: Meta<unknown> = {
    title: 'Cookbook/DragAndDrop',
    component: JsonForm,
    decorators: [
        MantineThemeDecorator,
        (Story) => (
            <div id="dragndrop--list">
                <style>{`
                    #dragndrop--list .rje-object__properties {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        gap: 1em;
                    }
                    #dragndrop--list .rje-object__properties > div {
                        width: 50%;
                    }
                    #dragndrop--list .rje-object__properties .rje-widget__label {
                        padding-top: 0;
                    }
                `}</style>
                <Story />
            </div>
        )
    ]
};

export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const DragDropLists: StoryObj<typeof JsonForm> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    },
    args: {
        onChange: (data) => console.log(JSON.stringify(data, null, 2)),
        data: {
            first: ['from first'],
            second: ['from second']
        },
        schema: {
            title: 'Drag and Drop between lists',
            type: 'object',
            properties: {
                first: {
                    type: 'array',
                    options: {
                        sortable: {
                            enabled: true,
                            group: 'first&second'
                        }
                    },
                    items: {
                        type: 'string',
                        default: 'from first'
                    }
                },
                second: {
                    type: 'array',
                    options: {
                        sortable: {
                            enabled: true,
                            group: 'first&second'
                        }
                    },
                    items: {
                        type: 'string',
                        default: 'from second'
                    }
                }
            }
        }
    }
};
