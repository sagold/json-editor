import { data, schema } from './data/longform';
import { NavigationWidget, widgets, Theme } from '@sagold/rje-aria-widgets';
import { useEditor } from '@sagold/react-json-editor';

export default {
    title: 'packages/rje-aria-widgets/examples/LongForm',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

export const LargeForm = () => {
    const editor = useEditor({ data, schema, widgets, plugins: [] });
    if (editor == null) {
        return null;
    }
    const WidgetComponent = editor.getWidget(editor.getNode());
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
