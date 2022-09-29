import { ObjectNode } from '@sagold/headless-json-editor';
import { EditorPlugin } from '../types';
import { getEditorHeader } from '../utils/getEditorHeader';
import { Message } from 'semantic-ui-react';
import { parentEditor } from './decorators';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/objecteditor/index.ts

export const ObjectEditor = parentEditor<ObjectNode>(({ node, instance, getEditor }) => {
    const Header = getEditorHeader(node);

    return (
        <div data-type="object">
            <Header>{node.options.title}</Header>
            <p>{node.options.description as string}</p>
            {node.errors.length > 0 && (
                <Message error>
                    {node.errors.map((e) => (
                        <Message.Item key={e.message}>{e.message}</Message.Item>
                    ))}
                </Message>
            )}
            {node.children.map((child) => {
                const Node = getEditor(child);
                return <Node node={child} instance={instance} getEditor={getEditor} key={child.id} />;
            })}
        </div>
    );
});

export const ObjectEditorPlugin: EditorPlugin = {
    id: 'object-editor',
    use: (node) => node.schema.type === 'object',
    Editor: ObjectEditor
};
