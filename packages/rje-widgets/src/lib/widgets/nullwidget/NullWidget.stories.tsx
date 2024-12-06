import { ComponentStory } from '@storybook/react';
import { useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { NullWidget } from './NullWidget';
import { Theme } from '../../components/theme/Theme';

export default {
  title: 'packages/rje-widgets/NullWidget',
  argTypes: {
    type: {
      options: ['toggle', 'checkbox'],
      control: { type: 'select' }
    },
    separator: {
      control: { type: 'boolean' }
    },
    disabled: {
      control: { type: 'boolean' }
    }
  }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
  const [node, editor] = useEditor({ schema, widgets, data, validate: true });
  return (
    <Theme>
      <NullWidget node={node} editor={editor} options={options} />
    </Theme>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: 'toggle',
  data: null,
  separator: false,
  disabled: false,
  schema: {
    title: 'Default null widget',
    type: 'null',
    description: 'use as inline header or for additional information'
  }
};
