import { ObjectNode, DefaultNodeOptions, getChildNode } from 'headless-json-editor';
import { Button, Card, Segment, Message, Icon, Grid, SemanticCOLORS } from 'semantic-ui-react';
import { useState } from 'react';
import { buildObjectLayout, ObjectLayout } from './buildObjectLayout';
import { widget, WidgetPlugin } from '../decorators';
import { EditJsonModal } from '../../components/editjsonmodal/EditJsonModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { classNames } from '../../classNames';
import { Widget } from '../../components/widget/Widget';

export type ObjectOptions = {
    /** additional classnames for object editor */
    classNames?: string[];
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

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor }) => {
    const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);

    let children: JSX.Element;
    if (options.layout && Array.isArray(options.layout.cells)) {
        const cells = buildObjectLayout(node, options.layout);
        children = (
            <div className="ed-object__items ed-object__items--grid">
                <Grid stackable columns="equal">
                    {cells.map((cell) => {
                        const child = getChildNode(node, cell.prop);
                        if (child == null) {
                            return null;
                        }
                        return (
                            <Grid.Column width={cell.width ?? 16} key={cell.prop} style={{ padding: 0 }}>
                                <Widget node={child} editor={editor} key={child.id} />
                            </Grid.Column>
                        );
                    })}
                </Grid>
            </div>
        );
    } else {
        children = (
            <div className="ed-object__items" style={{ boxShadow: 'none', border: 0 }}>
                {node.children.map((child) => (
                    <Widget node={child} editor={editor} key={child.id} />
                ))}
            </div>
        );
    }

    const { title, description, editJson, layout, header } = options;
    const inverted = header?.inverted ?? false;
    if (layout?.type === 'card') {
        return (
            <Card fluid data-type="object" data-id={node.pointer} className={options.classNames?.join(' ')}>
                <Card.Content key="header" style={{ background: header?.color }}>
                    {editJson && (
                        <Button basic floated="right" icon="edit outline" onClick={() => openEditModal(true)} />
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
                            editor={editor}
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
        <div
            className={classNames('ed-form ed-form--parent ed-object', options.classNames)}
            data-type="object"
            data-id={node.pointer}
        >
            {(editJson || title || description || options.collapsed != null) && (
                <ParentHeader
                    node={node}
                    options={options}
                    icon={
                        options.collapsed != null && (
                            <Icon
                                link
                                rotated={!showContent ? 'counterclockwise' : undefined}
                                name="dropdown"
                                onClick={() => setShowContent(!showContent)}
                            />
                        )
                    }
                >
                    {editJson && (
                        <Button basic inverted={inverted} icon="edit outline" onClick={() => openEditModal(true)} />
                    )}
                </ParentHeader>
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
            {showContent && children}
            {options.editJson && (
                <EditJsonModal
                    editor={editor}
                    node={node}
                    isOpen={isEditModalOpen}
                    title={options.title}
                    openEditModal={openEditModal}
                    liveUpdate={options.editJson?.liveUpdate}
                />
            )}
        </div>
    );
});

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
