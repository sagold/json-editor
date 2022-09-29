import { useJsonEditor, defaultEditors } from '../../index';
import { Form } from 'semantic-ui-react';
import { NavigationEditor } from '../editors/navigationeditor/NavigationEditor';
import { data, schema } from './data/longform';
import '../styles.scss';

export default {
    title: 'Example',
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

export const LongForm = () => {
    const [node, instance] = useJsonEditor({ data, schema, editors: defaultEditors, plugins: [] });
    if (node == null) {
        return;
    }

    const Editor = instance.getEditor(node);

    return (
        <div style={{ display: 'flex' }}>
            <div
                style={{
                    width: '400px',
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
                    <NavigationEditor node={node} instance={instance} />
                </div>
            </div>
            <div style={{ marginLeft: 448 }}>
                <Form error>
                    <Editor node={node} instance={instance} />
                </Form>
            </div>
        </div>
    );
};
