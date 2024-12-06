import { ComponentStory } from '@storybook/react';
import { UseEditorOptions, useEditor } from '@sagold/react-json-editor';
import { data, schema } from './data/features';
import { RemoteEnumOptionsPlugin } from 'headless-json-editor';
import { widgets } from '../../../rje-widgets/src';
import { Theme } from '../../../rje-widgets/src/lib/components/theme/Theme';

function SideBySideComponent({ schema, data, onChange }: UseEditorOptions) {
  const [node, editor] = useEditor({
    schema,
    widgets,
    onChange,
    plugins: [RemoteEnumOptionsPlugin],
    data
  });

  // @ts-ignore
  window.getEditor = () => editor;

  const ChildWidget = editor.getWidget(node);
  return (
    <Theme>
      <section
        id="side-by-side"
        style={{
          padding: 12,
          display: 'flex',
          justifyContent: 'space-evenly'
        }}
      >
        <div style={{ paddingRight: '12px', width: '100%', maxWidth: 560 }}>
          <ChildWidget node={node} editor={editor} />
        </div>
        <div style={{ paddingLeft: '12px', width: '100%', maxWidth: 560 }}>
          <ChildWidget node={node} editor={editor} />
        </div>
      </section>
    </Theme>
  );
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Examples/SideBySide'
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => {
  return (
    <div>
      <p>The following is the same editor rendered twice to test update mechanism</p>
      <SideBySideComponent
        schema={schema}
        data={data}
        onChange={(data, root) => {
          // console.log('on change', root);
        }}
      />
    </div>
  );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const SideBySide = Template.bind({});
