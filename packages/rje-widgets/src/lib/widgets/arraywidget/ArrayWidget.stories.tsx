import { ArrayWidget, ArrayOptions } from './ArrayWidget';
import { ComponentStory } from '@storybook/react';
import { Form } from 'semantic-ui-react';
import { JsonSchema, ArrayNode } from '@sagold/react-json-editor';
import { useJsonEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';

export default {
    title: 'packages/rje-widgets/ArrayWidget',
    component: ArrayWidget,
    argTypes: {
        data: { control: { type: 'object' } },
        schema: { control: { type: 'object' } },
        options: {
            control: { type: 'object' }
        }
    }
};

type ComponentStoryProps = {
    data: unknown[];
    schema: JsonSchema;
    options?: Partial<ArrayOptions>;
};

const Template: ComponentStory<any> = ({ data, schema, options = {} }: ComponentStoryProps) => {
    const [node, editor] = useJsonEditor<ArrayNode<ArrayOptions>>({
        schema,
        widgets,
        data,
        validate: true
    });
    return (
        <Form error>
            <ArrayWidget node={node} editor={editor} options={options} />
        </Form>
    );
};

export const DefaultWidget = Template.bind({});
DefaultWidget.args = {
    data: [
        { title: 'first value', value: 1 },
        { title: 'wrong value type', value: 'four' },
        { title: 'large number', value: 10009919291923 },
        { title: 'empty' }
    ],
    schema: {
        title: 'Array Example',
        description:
            'Description displayed as subheader. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Post enim Chrysippum eum non sane est disputatum. Scientiam pollicentur, quam non erat mirum sapientiae cupido patria esse cariorem. Satis est ad hoc responsum. Hoc est vim afferre, Torquate, sensibus, extorquere ex animis cognitiones verborum, quibus inbuti sumus. Quid ergo attinet gloriose loqui, nisi constanter loquare? Aliter enim nosmet ipsos nosse non possumus. Sin tantum modo ad indicia veteris memoriae cognoscenda, curiosorum. Duo Reges: constructio interrete. Quid enim mihi potest esse optatius quam cum Catone, omnium virtutum auctore, de virtutibus disputare? Quantum Aristoxeni ingenium consumptum videmus in musicis?',
        type: 'array',
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
    },
    options: {
        sortable: {
            enabled: true
        },
        collapsed: false,
        header: {
            inverted: false,
            color: undefined
        },
        editJson: {
            enabled: false,
            liveUpdate: false
        },
        layout: {
            type: 'default'
        }
    }
};

export const DragAndDrop = Template.bind({});
DragAndDrop.args = {
    ...DefaultWidget.args,
    options: {
        sortable: {
            enabled: true
        }
    }
};

export const Collapsible = Template.bind({});
Collapsible.args = {
    ...DefaultWidget.args,
    options: {
        collapsed: true
    }
};

export const LayoutOptions = Template.bind({});
LayoutOptions.args = {
    ...DefaultWidget.args,
    options: {
        layout: {
            type: 'cards'
        }
    }
};

export const HeaderOptions = Template.bind({});
HeaderOptions.args = {
    ...DefaultWidget.args,
    options: {
        header: {
            inverted: true
        }
    }
};

export const EditJsonOptions = Template.bind({});
EditJsonOptions.args = {
    ...DefaultWidget.args,
    options: {
        editJson: {
            enabled: true,
            liveUpdate: true
        }
    }
};
