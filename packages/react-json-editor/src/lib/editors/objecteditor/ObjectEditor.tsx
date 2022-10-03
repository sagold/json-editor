import { ObjectNode, Node, DefaultNodeOptions, getChildNode } from 'headless-json-editor';
import { Button, Segment, Header, Message, Accordion, Icon, Grid } from 'semantic-ui-react';
import { useState } from 'react';
import { split } from 'gson-pointer';
import { buildObjectLayout, ObjectLayout } from './buildObjectLayout';
import { editor, EditorPlugin } from '../decorators';
import { EditJsonModal } from '../../components/editjsonmodal/EditJsonModal';

function getNodeDepth(node: Node, max = 6) {
    const depth = split(node.pointer).length;
    return Math.min(max, depth + 1);
}

export type ObjectOptions = {
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        /** if true, will update on each change if input is a valid json format */
        liveUpdate?: boolean;
    };
    /**
     * Arrange properties within a 16 columns grid.
     * Format: `[{ prop: "title", width: 8 }, ...]`. Use `{ prop: '*', width: 16 }` to reference remaining properties
     */
    layout?: ObjectLayout;
} & DefaultNodeOptions;

export const ObjectEditor = editor<ObjectNode<ObjectOptions>>(({ node, options, instance }) => {
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);

    let children: JSX.Element;
    const errors =
        node.errors.length > 0 ? (
            <Message error>
                {node.errors.map((e) => (
                    <Message.Item key={e.message}>{e.message}</Message.Item>
                ))}
            </Message>
        ) : null;

    if (options.layout && Array.isArray(options.layout.cells)) {
        const cells = buildObjectLayout(node, options.layout);
        children = (
            <Grid stackable columns="equal">
                {cells.map((cell) => {
                    const child = getChildNode(node, cell.prop);
                    if (child == null) {
                        return null;
                    }
                    const ChildEditor = instance.getEditor(child);
                    return (
                        <Grid.Column width={cell.width ?? 16}>
                            <ChildEditor node={child} instance={instance} key={child.id} />
                        </Grid.Column>
                    );
                })}
            </Grid>
        );
    } else {
        children = (
            <>
                {node.children.map((child) => {
                    const ChildEditor = instance.getEditor(child);
                    return <ChildEditor node={child} instance={instance} key={child.id} />;
                })}
            </>
        );
    }

    if (options.collapsed == null) {
        return (
            <div data-type="object" data-id={node.pointer}>
                {options.title && (
                    <Grid>
                        <Grid.Column width="15">
                            <Header as={`h${getNodeDepth(node)}`}>
                                <Header.Content>{options.title}</Header.Content>
                            </Header>
                        </Grid.Column>
                        {options.editJson && (
                            <Grid.Column width="1" textAlign="right">
                                <Button.Group>
                                    <Button icon="edit" onClick={() => openEditModal(true)} />
                                </Button.Group>
                            </Grid.Column>
                        )}
                    </Grid>
                )}
                {options.description && <p>{options.description as string}</p>}
                {errors}
                {children}
                {options.editJson && (
                    <EditJsonModal
                        instance={instance}
                        node={node}
                        isOpen={isEditModalOpen}
                        title={options.title}
                        openEditModal={openEditModal}
                        liveUpdate={options.editJson?.liveUpdate}
                    />
                )}
            </div>
        );
    }

    return (
        <Accordion data-type="object" data-id={node.pointer}>
            <Accordion.Title active={isOpen}>
                <Segment basic clearing>
                    <Header as={`h${getNodeDepth(node)}`} onClick={() => setToggleState(!isOpen)}>
                        <Icon name="dropdown" link />
                        {options.title}
                    </Header>
                    {options.editJson && (
                        <Header floated="right">
                            <Icon name="edit" link onClick={() => openEditModal(true)} />
                        </Header>
                    )}
                </Segment>

                {options.description && <p>{options.description as string}</p>}
            </Accordion.Title>
            <Accordion.Content active={isOpen}>
                {errors}
                {children}
            </Accordion.Content>
            {options.editJson && (
                <EditJsonModal
                    instance={instance}
                    node={node}
                    isOpen={isEditModalOpen}
                    title={options.title}
                    openEditModal={openEditModal}
                    liveUpdate={options.editJson?.liveUpdate}
                />
            )}
        </Accordion>
    );
});

export const ObjectEditorPlugin: EditorPlugin = {
    id: 'object-editor',
    use: (node) => node.schema.type === 'object',
    Editor: ObjectEditor
};
