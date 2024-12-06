import { ComponentStory } from '@storybook/react';
import { SingleSelectOptions, Item } from './SelectOptions';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
  decorators: [ThemeDecorator],
  component: SingleSelectOptions,
  title: 'packages/rje-widgets/components/options/SingleSelectOptions',
  args: {
    label: {
      control: 'text'
    }
  }
};

const Template: ComponentStory<typeof SingleSelectOptions> = ({ ...options }) => {
  return (
    <SingleSelectOptions {...options}>
      {options.children.map((value) => (
        <Item key={value}>{value}</Item>
      ))}
    </SingleSelectOptions>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: '',
  children: ['apple', 'orange', 'kiwi', 'mango', 'raspberry'],
  onPress: (value) => console.log('value', value)
};
