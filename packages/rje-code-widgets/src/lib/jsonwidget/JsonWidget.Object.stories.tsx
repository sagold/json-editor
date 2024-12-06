import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import defaultWidgets, { JsonForm } from '@sagold/rje-widgets';
import { JsonWidget, JsonWidgetPlugin } from './JsonWidget';
import { ThemeDecorator } from '../../../../rje-widgets/src/lib/components/ThemeDecorator';
import '../rje-code-widgets.scss';

type Story = StoryObj<typeof JsonWidget>;
const meta: Meta<typeof JsonWidget> = {
  title: 'packages/rje-code-widgets/JsonWidget/Object',
  component: JsonWidget,
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark']
    }
  },
  decorators: [ThemeDecorator],
  render({ schema, data, theme }) {
    const s = {
      ...schema,
      options: {
        ...schema.options,
        theme
      }
    };

    return (
      <JsonForm
        addOptionalProps={false}
        schema={s}
        data={data}
        widgets={[JsonWidgetPlugin, ...defaultWidgets]}
        style={{ width: '100%' }}
      />
    );
  }
};
export default meta;

export const Default: Story = {
  args: {
    schema: {
      type: 'object',
      format: 'json',
      options: {
        theme: 'dark'
      },
      required: ['string', 'number', 'object'],
      properties: {
        string: {
          type: 'string',
          title: 'a string value'
        },
        number: {
          type: 'number',
          title: 'a number value',
          description:
            'if this value is a string, it will get converted as number or not stored at all - but still being displayed'
        },
        object: {
          type: 'object',
          title: 'an object with required title and subTitle',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            subTitle: { type: 'string' }
          }
        }
      }
    }
  }
};
