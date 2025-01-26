import type { Meta, StoryObj } from '@storybook/react';
import { useEditor, UseEditorOptions } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { DateWidget, type DateOptions } from './DateWidget';
import { MantineThemeDecorator } from '../../docs/MantineThemeDecorator';

type DateWidgetStoryProps = UseEditorOptions & DateOptions & { data: string };

function DateWidgetStory({ data = '', schema, ...options }: DateWidgetStoryProps) {
    const s = { ...schema };
    const editor = useEditor<string>({ schema: s, widgets, data, validate: true });
    if (editor == null) {
        return null;
    }
    return (
        <>
            <DateWidget node={editor.getNode()} editor={editor} options={options} />
            <code style={{ paddingTop: 8, display: 'block' }}>{editor.getData()}</code>
        </>
    );
}

type Story = StoryObj<DateWidgetStoryProps>;

const meta: Meta<DateWidgetStoryProps> = {
    title: 'packages/rje-mantine-widgets/widgets/DateWidget',
    decorators: [MantineThemeDecorator],
    component: DateWidgetStory,
    argTypes: {}
};

export default meta;

export const Default: Story = {
    args: {
        data: '2024-12-10',
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
        schema: {
            title: 'Format date-time',
            type: 'string',
            format: 'date-time'
        }
    }
};

export const FormatDateTimeRequired: Story = {
    args: {
        validate: true,
        data: '',
        schema: {
            title: 'Format date-time',
            type: 'string',
            format: 'date-time',
            minLength: 1
        }
    }
};

export const FormatDate: Story = {
    args: {
        data: '2023-08-20',
        schema: {
            title: 'Format date',
            type: 'string',
            format: 'date'
        }
    }
};

export const FormatTime: Story = {
    args: {
        data: '20:01:00Z',
        schema: {
            title: 'Format time',
            type: 'string',
            format: 'time',
            minLength: 1
        }
    }
};

export const FormatTimeInvalid: Story = {
    args: {
        data: '13:04:52+12:00',
        schema: {
            title: 'Invalid format time',
            type: 'string',
            format: 'time'
        }
    }
};
