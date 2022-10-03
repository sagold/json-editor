import { ObjectNode, Node, DefaultNodeOptions, getChildNode } from 'headless-json-editor';
import { Button, Card, Segment, Header, Message, Accordion, Icon, Grid, SemanticCOLORS } from 'semantic-ui-react';
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
    layout?: ObjectLayout & {
        type?: 'default' | 'card';
    };
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;

export const ObjectEditor = editor<ObjectNode<ObjectOptions>>(({ node, options, instance }) => {
    const [isOpen, setToggleState] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);

    let children: JSX.Element;
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
                        <Grid.Column width={cell.width ?? 16} key={cell.prop} style={{ padding: 0 }}>
                            <ChildEditor node={child} instance={instance} key={child.id} />
                        </Grid.Column>
                    );
                })}
            </Grid>
        );
    } else {
        children = (
            <Segment.Group style={{ boxShadow: 'none', border: 0 }}>
                {node.children.map((child) => {
                    const ChildEditor = instance.getEditor(child);
                    return <ChildEditor node={child} instance={instance} key={child.id} />;
                })}
            </Segment.Group>
        );
    }

    const { title, description, editJson, layout, header } = options;
    const inverted = header?.inverted ?? false;
    if (layout?.type === 'card') {
        return (
            <Card fluid data-type="object" data-id={node.pointer}>
                <Card.Content key="header" style={{ background: header?.color }}>
                    {editJson && (
                        <Button floated="right" link icon="ellipsis vertical" onClick={() => openEditModal(true)} />
                    )}
                    <Card.Header>{title}</Card.Header>
                    <Card.Meta>{description}</Card.Meta>
                </Card.Content>
                <Card.Content key="content">
                    {node.errors.length > 0 && (
                        <Segment basic>
                            <Message error>
                                {node.errors.map((e) => (
                                    <Message.Item key={e.message}>{e.message}</Message.Item>
                                ))}
                            </Message>
                        </Segment>
                    )}
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
                </Card.Content>
            </Card>
        );
    }

    return (
        <Accordion data-type="object" data-id={node.pointer}>
            {(editJson || title || description || options.collapsed != null) && (
                <Accordion.Title active={isOpen}>
                    <Segment basic color={header?.color} inverted={inverted}>
                        <Grid columns="equal">
                            <Grid.Column>
                                <Header as={`h${getNodeDepth(node)}`} inverted={inverted}>
                                    {options.collapsed != null && (
                                        <Header.Content floated="left">
                                            <Icon name="dropdown" onClick={() => setToggleState(!isOpen)} />
                                        </Header.Content>
                                    )}
                                    <Header.Content>{title}</Header.Content>
                                    <Header.Subheader>{description}</Header.Subheader>
                                </Header>
                            </Grid.Column>
                            {editJson && (
                                <Grid.Column textAlign="right">
                                    <Icon
                                        inverted={inverted}
                                        link
                                        name="ellipsis vertical"
                                        onClick={() => openEditModal(true)}
                                    />
                                </Grid.Column>
                            )}
                        </Grid>
                    </Segment>
                </Accordion.Title>
            )}
            {node.errors.length > 0 && (
                <Segment basic>
                    <Message error>
                        {node.errors.map((e) => (
                            <Message.Item key={e.message}>{e.message}</Message.Item>
                        ))}
                    </Message>
                </Segment>
            )}
            <Accordion.Content active={isOpen}>{children}</Accordion.Content>
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
