import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { JsonSchema, useJsonEditor, StringNode } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { DateWidget, type DateOptions } from './DateWidget';
import { Theme } from '../../components/theme/Theme';

type DateWidgetStoryProps = {
    data: string;
    schema: JsonSchema;
} & DateOptions;

function DateWidgetStory({ data = '', schema, ...options }: DateWidgetStoryProps) {
    const s = { ...schema };
    const [node, editor] = useJsonEditor<string, StringNode>({ schema: s, widgets, data, validate: true });
    return (
        <Theme>
            <DateWidget node={node} editor={editor} options={options} />
            <code style={{ paddingTop: 8, display: 'block' }}>{editor.getData()}</code>
        </Theme>
    );
}

type Story = StoryObj<DateWidgetStoryProps>;

const meta: Meta<DateWidgetStoryProps> = {
    title: 'packages/rje-widgets/DateWidget',
    // decorators: [ThemeDecorator],
    component: DateWidgetStory,
    argTypes: {
        // data: {
        //     control: { type: 'text' }
        // },
        // placeholder: {
        //     control: { type: 'text' }
        // },
        // liveUpdate: {
        //     control: { type: 'boolean' }
        // },
        // icon: {
        //     control: { type: 'text' }
        // },
        // swapIconPosition: {
        //     control: { type: 'boolean' }
        // },
        // tag: {
        //     control: { type: 'text' }
        // },
        // disabled: {
        //     control: { type: 'boolean' }
        // },
        // readOnly: {
        //     control: { type: 'boolean' }
        // },
        // required: {
        //     control: { type: 'boolean' }
        // },
        // format: {
        //     control: { type: 'select' },
        //     options: ['text', 'password']
        // }
    }
};

export default meta;

export const Default: Story = {
    args: {
        schema: {
            title: 'Default date widget',
            type: 'string',
            format: 'date'
        }
    }
};

export const FormatDateTime: Story = {
    args: {
        data: '2023-08-20T14:56:17.657Z',
        // data: 'some input string',
        // liveUpdate: false,
        // icon: undefined,
        // tag: undefined,
        // swapIconPosition: false,
        // disabled: false,
        // readOnly: false,
        // required: false,
        schema: {
            title: 'Format date-time',
            type: 'string',
            format: 'date-time'
        }
    }
};

export const FormatDate: Story = {
    args: {
        data: '2023-08-20',
        // data: 'some input string',
        // liveUpdate: false,
        // icon: undefined,
        // tag: undefined,
        // swapIconPosition: false,
        // disabled: false,
        // readOnly: false,
        // required: false,
        schema: {
            title: 'Format date',
            type: 'string',
            format: 'date'
        }
    }
};

// export const ErrorState: Story = {
//     args: {
//         data: 'some input string',
//         schema: {
//             title: 'Default string widget',
//             type: 'string',
//             maxLength: 4
//         }
//     }
// };
