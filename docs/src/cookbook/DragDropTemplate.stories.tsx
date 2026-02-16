import Sortable from 'sortablejs';
import { JsonForm, Editor, getParentArrayPointer } from '@sagold/rje-mantine-widgets';
import { Meta, StoryObj } from '@storybook/react-vite';
import { MantineThemeDecorator } from '../decorators/MantineThemeDecorator';
import { useEffect, useRef, useState } from 'react';
import { JsonSchema } from 'headless-json-editor';

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
    useEffect(() => {
        if (ref.current && editor) {
            // TODO destroy instance
            Sortable.create(ref.current, {
                handle: '.template',
                swapThreshold: 4,
                animation: 1,
                delay: 1,
                sort: false,
                group: { name: 'receive-templates', pull: 'clone' },
                onEnd(event: Sortable.SortableEvent) {
                    const targetIndex = parseInt(`${event.newIndex}`);
                    if (isNaN(targetIndex) || editor == null) {
                        return;
                    }
                    const { item, to } = event;
                    const targetPointer = getParentArrayPointer(to);
                    if (targetPointer == null) {
                        return;
                    }

                    const targetArray = editor.getData(targetPointer) as unknown[];
                    targetArray.splice(targetIndex, 0, item.getAttribute('data-value'));
                    console.log('TO', targetPointer, targetIndex, targetArray);
                    editor.setValue(targetPointer, targetArray);
                    // remove dragged html which got injected into dom
                    item.parentElement?.removeChild(item);
                    console.log('set');
                }
            });
        }
    }, [ref, editor]);
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
                    editor={setEditor}
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
