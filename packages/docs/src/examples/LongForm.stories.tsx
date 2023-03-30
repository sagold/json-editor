import { useJsonEditor } from '@sagold/react-json-editor';
import { data, schema } from './data/longform';
import { NavigationWidget, widgets } from '@sagold/rje-widgets';
import theme from '../../../rje-widgets/src/lib/theme';

export default {
    title: 'Examples/LargeForm',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

export const LargeForm = () => {
    const [node, editor] = useJsonEditor({ data, schema, widgets, plugins: [] });
    const WidgetComponent = editor.getWidget(node);

    return (
        <div style={{ display: 'flex', ...theme }} className="rje-theme--light">
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
        </div>
    );
};
