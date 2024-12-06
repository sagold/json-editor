import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TagList, TagListProps } from './TagList';
import { ThemeDecorator } from '../ThemeDecorator';

type TagListStoryProps = TagListProps;

type Story = StoryObj<TagListStoryProps>;
const meta: Meta<TagListStoryProps> = {
  title: 'packages/rje-widgets/components/TagList',
  decorators: [ThemeDecorator],
  component: TagList,
  args: {
    onRemove: undefined,
    onSelectionChange: (keys) => {
      console.log('selection', keys);
    },
    displayValue: (item) => item.title,
    items: [
      { id: '1', title: 'news' },
      { id: '2', title: 'travel' },
      { id: '3', title: 'gaming' },
      { id: '4', title: 'shopping' }
    ]
  }
};
export default meta;

export const Default: Story = {
  args: {
    label: 'Tag Group Component'
  }
};

export const Removable: Story = {
  args: {
    label: 'Tag Group Component',
    onRemove: (keys) => {
      console.log('remove', keys);
    }
  }
};

export const SelectSingle: Story = {
  args: {
    label: 'Tag Group Component',
    selectionMode: 'single',
    defaultSelectedKeys: [2]
  }
};

export const SelectMultiple: Story = {
  args: {
    label: 'Tag Group Component',
    selectionMode: 'multiple',
    defaultSelectedKeys: ['2', '3'],
    onSelectionChange(keys) {}
  }
};

export const RemovableSelectMultiple: Story = {
  args: {
    label: 'Tag Group Component',
    selectionMode: 'multiple',
    onRemove: (keys) => {
      console.log('remove', keys);
    }
  }
};
