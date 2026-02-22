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
    title: 'Drag and Drop between lists',
    type: 'array',
    options: {
        sortable: {
            enabled: true,
            group: 'receive-templates'
        }
    },
    items: {
        type: 'string',
        default: 'item default value'
    }
};

function TemplateStory() {
    const ref = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<Editor>();
    useDraggableTemplates(ref, editor, '.template');
    return (
        <div id="dragndrop--template">
            <style>{`
            #dragndrop--template .columns {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                gap: 1em;
            }
            #dragndrop--template .columns > div {
                width: 50%;
            }
            #dragndrop--template .template {
                position: relative;
                padding: 1em;
                border: 1px solid #ccc;
                background: #f0f0f9;
                margin-top: 1em;
                border-radius: 4px;
                cursor: pointer;
                text-align: center;
                user-select: none;
                &:hover {
                    background: #f6f6fc;
                }
            }
        `}</style>
            <div className="columns">
                <JsonForm
                    editor={(editor) => editor && setEditor(editor)}
                    schema={schema}
                    data={['item default value']}
                    onChange={(data) => console.log(data)}
                />
                <div style={{ padding: '1em', paddingTop: 0 }}>
                    <em style={{ fontSize: '0.8em' }}>
                        The following are templates that can be dragged into the list to create the specific item
                    </em>
                    <div className="templates" ref={ref}>
                        <div className="template" data-value="hello (salve)">
                            hello
                        </div>
                        <div className="template" data-value="bye (arrividerci)">
                            bye
                        </div>
                    </div>
                </div>
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
export const DragDropTemplate: StoryObj<typeof JsonForm> = {
    parameters: {
        controls: { hideNoControlsWarning: true }
    }
};
