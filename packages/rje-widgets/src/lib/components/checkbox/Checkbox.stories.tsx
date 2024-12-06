import { ComponentStory } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { ThemeDecorator } from '../ThemeDecorator';

export default {
  decorators: [ThemeDecorator],
  component: Checkbox,
  title: 'packages/rje-widgets/components/Checkbox'
};

const Template: ComponentStory<typeof Checkbox> = ({ children, ...options }) => {
  return (
    <>
      <Checkbox {...options} defaultSelected={false} />
      <Checkbox {...options} defaultSelected={true} />
      <Checkbox {...options}>todo</Checkbox>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  'aria-label': 'todo'
};
