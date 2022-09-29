import { ObjectNode } from 'headless-json-editor';
import { getEditorHeader } from '../utils/getEditorHeader';
import { Message } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/objecteditor/index.ts

export const ObjectEditor = editor<ObjectNode>(({ node, instance }) => {
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
                const ChildEditor = instance.getEditor(child);
                return <ChildEditor node={child} instance={instance} key={child.id} />;
            })}
        </div>
    );
});

export const ObjectEditorPlugin: EditorPlugin = {
    id: 'object-editor',
    use: (node) => node.schema.type === 'object',
    Editor: ObjectEditor
};
