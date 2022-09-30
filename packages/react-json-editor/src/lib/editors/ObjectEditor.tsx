import { ObjectNode, DefaultNodeOptions, json } from 'headless-json-editor';
import { getEditorHeader } from '../utils/getEditorHeader';
import { Message, Accordion, Icon } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';
import { useState } from 'react';

// for comparison https://github.com/sueddeutsche/editron/blob/master/src/editors/objecteditor/index.ts

export type ObjectOptions = {
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
} & DefaultNodeOptions;

export const ObjectEditor = editor<ObjectNode<ObjectOptions>>(({ node, options, instance }) => {
    const Header = getEditorHeader(node);
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);

    const content = (
        <>
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
        </>
    );

    if (options.collapsed == null) {
        return (
            <div data-type="object" data-id={node.pointer}>
                <Header>{options.title}</Header>
                <p>{options.description as string}</p>
                {content}
            </div>
        );
    }

    return (
        <Accordion data-type="object" data-id={node.pointer}>
            <Accordion.Title active={isOpen}>
                <Header onClick={() => setToggleState(!isOpen)}>
                    <Icon name="dropdown" link />
                    {options.title}
                </Header>
                <p>{options.description as string}</p>
            </Accordion.Title>
            <Accordion.Content active={isOpen}>{content}</Accordion.Content>
        </Accordion>
    );
});

export const ObjectEditorPlugin: EditorPlugin = {
    id: 'object-editor',
    use: (node) => node.schema.type === 'object',
    Editor: ObjectEditor
};
