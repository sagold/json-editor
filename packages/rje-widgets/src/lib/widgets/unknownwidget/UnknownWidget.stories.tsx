import { ComponentStory } from '@storybook/react';
import { useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { UnknownWidget } from './UnknownWidget';
import { Theme } from '../../components/theme/Theme';

export default {
  title: 'packages/rje-widgets/UnknownWidget',
  argTypes: {
    data: {
      control: { type: 'boolean' }
    },
    type: {
      options: ['toggle', 'checkbox'],
      control: { type: 'select' }
    },
    disabled: {
      control: { type: 'boolean' }
    },
    readOnly: {
      control: { type: 'boolean' }
    },
    required: {
      control: { type: 'boolean' }
    }
  }
};

const Template: ComponentStory<any> = ({ data, schema, ...options }) => {
  const [node, editor] = useEditor({ schema, widgets, data, validate: true });
  return (
    <Theme>
      <UnknownWidget node={node} editor={editor} options={options} />
    </Theme>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: 'toggle',
  data: false,
  schema: {}
};
