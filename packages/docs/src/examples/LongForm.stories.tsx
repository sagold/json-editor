import { useEditor } from '@sagold/react-json-editor';
import { data, schema } from './data/longform';
import { NavigationWidget, widgets } from '@sagold/rje-widgets';
import { Theme } from '../../../rje-widgets/src/lib/components/theme/Theme';

export default {
  title: 'Examples/LargeForm',
  argTypes: {
    data: { control: { type: 'object' }, defaultValue: data },
    schema: { control: { type: 'object' }, defaultValue: schema }
  }
};

export const LargeForm = () => {
  const [node, editor] = useEditor({ data, schema, widgets, plugins: [] });
  const WidgetComponent = editor.getWidget(node);

  return (
    <Theme>
      <div
        style={{
          zIndex: 100,
          width: '20%',
          position: 'fixed',
          height: '100%',
          paddingBottom: 48,
          marginRight: 24,
          borderRight: '1px solid black',
          overflow: 'scroll',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ paddingRight: 24 }}>
          <NavigationWidget node={node} editor={editor} />
        </div>
      </div>
      <div style={{ marginLeft: '20%', paddingLeft: 48 }}>
        <div className="rje-form">
          <WidgetComponent node={node} editor={editor} />
        </div>
      </div>
    </Theme>
  );
};
