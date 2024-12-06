import type { Meta, StoryObj } from '@storybook/react';
import { ArrayWidget, ArrayOptions } from './ArrayWidget';
import { JsonSchema, ArrayNode, useEditor } from '@sagold/react-json-editor';
import { widgets } from '../index';
import { Theme } from '../../components/theme/Theme';

type StoryProps = {
  controls: boolean;
  inlineAddItemOption: boolean;
  data: unknown[];
  schema: JsonSchema;
  options?: Partial<ArrayOptions>;
};

type Story = StoryObj<StoryProps>;

function StoryComponent({ data, schema, controls, inlineAddItemOption, options = {} }: StoryProps) {
  const [node, editor] = useEditor<unknown[], ArrayNode<ArrayOptions>>({
    schema,
    widgets,
    data,
    validate: true
  });
  return (
    <Theme>
      <ArrayWidget node={node} editor={editor} options={{ ...options, controls, inlineAddItemOption }} />
    </Theme>
  );
}

const meta: Meta<typeof StoryComponent> = {
  title: 'packages/rje-widgets/ArrayWidget',
  // decorators: [ThemeDecorator],
  component: StoryComponent,
  args: {
    controls: true,
    inlineAddItemOption: true
  },
  argTypes: {
    controls: { type: 'boolean' },
    data: { control: { type: 'object' } },
    schema: { control: { type: 'object' } },
    options: {
      control: { type: 'object' }
    }
  }
};

export default meta;

export const DefaultWidget: Story = {
  args: {
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
        enabled: false
      },
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
  }
};

export const ItemSelection: Story = {
  args: {
    options: {
      collapsed: false
    },
    schema: {
      title: 'Array Item Selection Example',
      description:
        'Description displayed as subheader. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Post enim Chrysippum eum non sane est disputatum. Scientiam pollicentur, quam non erat mirum sapientiae cupido patria esse cariorem. Satis est ad hoc responsum. Hoc est vim afferre, Torquate, sensibus, extorquere ex animis cognitiones verborum, quibus inbuti sumus. Quid ergo attinet gloriose loqui, nisi constanter loquare? Aliter enim nosmet ipsos nosse non possumus. Sin tantum modo ad indicia veteris memoriae cognoscenda, curiosorum. Duo Reges: constructio interrete. Quid enim mihi potest esse optatius quam cum Catone, omnium virtutum auctore, de virtutibus disputare? Quantum Aristoxeni ingenium consumptum videmus in musicis?',
      type: 'array',
      items: {
        oneOfProperty: 'type',
        oneOf: [
          {
            title: 'header',
            type: 'object',
            required: ['type', 'title'],
            properties: {
              type: { type: 'string', const: 'header', options: { hidden: true } },
              title: { type: 'string', title: 'title', format: 'textarea' }
            }
          },
          {
            title: 'article',
            type: 'object',
            required: ['type', 'content'],
            properties: {
              type: { type: 'string', const: 'article', options: { hidden: true } },
              content: { type: 'string', title: 'content', format: 'textarea' }
            }
          }
        ]
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    ...DefaultWidget.args,
    options: {
      disabled: true
    }
  }
};

export const DragAndDrop: Story = {
  args: {
    ...DefaultWidget.args,
    options: {
      sortable: {
        enabled: true
      },
      editJson: {
        enabled: true
      }
    }
  }
};

export const Collapsible: Story = {
  args: {
    ...DefaultWidget.args,
    options: {
      collapsed: true
    }
  }
};

export const ReadOnly: Story = {
  args: {
    ...DefaultWidget.args,
    options: {
      readOnly: true
    }
  }
};

export const EditJsonOptions: Story = {
  args: {
    ...DefaultWidget.args,
    options: {
      editJson: {
        enabled: true,
        liveUpdate: true
      }
    }
  }
};
