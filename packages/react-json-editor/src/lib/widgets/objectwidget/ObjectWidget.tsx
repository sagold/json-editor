import { ObjectNode, DefaultNodeOptions, getChildNode, json } from 'headless-json-editor';
import { Button, Card, Segment, Message, Icon, List, Grid, Popup, SemanticCOLORS } from 'semantic-ui-react';
import { useState } from 'react';
import { buildObjectLayout, ObjectLayout } from './buildObjectLayout';
import { widget, WidgetPlugin } from '../decorators';
import { WidgetModal, WidgetModalSize } from '../../components/widgetmodal/WidgetModal';
import { ParentHeader } from '../../components/parentheader/ParentHeader';
import { classNames } from '../../classNames';
import { Widget } from '../../components/widget/Widget';
import { JsonEditor } from '../../JsonEditor';

function ObjectOptions({
    node,
    options,
    editor
}: {
    node: ObjectNode<ObjectOptions>;
    options: ObjectOptions;
    editor: JsonEditor;
}) {
    const { title, description, editJson = {}, layout, header, isOptional } = options;
    const inverted = header?.inverted ?? false;
    const [isEditModalOpen, openEditModal] = useState<boolean>(false);

    if (isOptional !== true && editJson.enabled !== true && node.optionalProperties.length === 0) {
        return null;
    }

    return (
        <>
            <Popup
                className="rje-object__options"
                trigger={<Button basic inverted={inverted} icon="options" style={{ boxShadow: 'none' }} />}
                flowing
                hoverable
                disabled={false}
            >
                <List divided relaxed="very">
                    {isOptional && (
                        <List.Item className="clickable" onClick={() => editor.removeValue(node.pointer)}>
                            <List.Icon name="trash" />
                            <List.Content>Remove Object</List.Content>
                        </List.Item>
                    )}
                    {editJson.enabled && (
                        <List.Item className="clickable" onClick={() => openEditModal(true)}>
                            <List.Icon name="edit outline" />
                            <List.Content>Edit Json</List.Content>
                        </List.Item>
                    )}
                    {node.optionalProperties.length > 0 && (
                        <List.Item>
                            <List.Content>
                                <List.Header>Optional Properties</List.Header>
                                <List.List>
                                    {node.optionalProperties.map((property) =>
                                        node.missingProperties.includes(property) ? (
                                            <List.Item
                                                className="clickable"
                                                key={property}
                                                onClick={() => editor.addValue(`${node.pointer}/${property}`)}
                                            >
                                                <List.Icon name="add" />
                                                <List.Content>{property}</List.Content>
                                            </List.Item>
                                        ) : (
                                            <List.Item
                                                className="clickable"
                                                key={property}
                                                onClick={() => editor.removeValue(`${node.pointer}/${property}`)}
                                            >
                                                <List.Icon name="trash" />
                                                <List.Content>{property}</List.Content>
                                            </List.Item>
                                        )
                                    )}
                                </List.List>
                            </List.Content>
                        </List.Item>
                    )}
                </List>
            </Popup>
            <WidgetModal
                editor={editor}
                node={node}
                options={{ modalSize: editJson.modalSize, ...options, widget: 'json' }}
                isOpen={isEditModalOpen}
                closeModal={() => openEditModal(false)}
            />
        </>
    );
}

export type ObjectOptions = {
    /** additional classnames for object editor */
    classNames?: string[];
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    editJson?: {
        enabled?: boolean;
        modalSize?: WidgetModalSize;
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
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline buttons at the end of the object to add optional missing properties */
    inlineAddPropertyOption?: boolean;
    /** set to true to show a delete button after each optional property */
    inlineDeletePropertyOption?: boolean;
} & DefaultNodeOptions;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor, setValue }) => {
    const [showContent, setShowContent] = useState<boolean>(options.collapsed ? !options.collapsed : true);

    const { title, description, editJson = {}, layout, header } = options;
    const inverted = header?.inverted ?? false;
    const showHeader = editJson.enabled || title || description || options.collapsed != null;
    const withInlineDelete = options.inlineDeletePropertyOption ?? !showHeader;
    const withInlineAdd = options.inlineAddPropertyOption ?? !showHeader;

    const childOptions: Record<string, any> = {};
    options.disabled && (childOptions.disabled = true);
    options.readOnly && (childOptions.readOnly = true);

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
                            <Grid.Column key={cell.prop} width={cell.width ?? 16} style={{ padding: 0 }}>
                                <Widget node={child} editor={editor} key={child.id} options={childOptions} />
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
                    <div key={child.id} className="ed-object-item">
                        <Widget
                            node={child}
                            editor={editor}
                            options={{ ...childOptions, isOptional: node.optionalProperties.includes(child.property) }}
                        />
                        {withInlineDelete && (
                            <div className="ed-object-item__actions">
                                {node.optionalProperties.includes(child.property) && (
                                    <Button
                                        onClick={() => editor.removeValue(child.pointer)}
                                        size="mini"
                                        basic
                                        icon="trash alternate outline"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (layout?.type === 'card') {
        return (
            <Card fluid data-type="object" data-id={node.pointer} className={options.classNames?.join(' ')}>
                <Card.Content key="header" style={{ background: header?.color }}>
                    <ObjectOptions editor={editor} node={node} options={options} />
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
            {showHeader && (
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
                    <ObjectOptions editor={editor} node={node} options={options} />
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
            {withInlineAdd && node.missingProperties.length > 0 && (
                <div className="rje-object__missing-properties">
                    {node.missingProperties.map((name) => (
                        <Button
                            key={name}
                            content={name}
                            icon="plus"
                            basic
                            size="small"
                            // onClick={() => setValue({ ...(json(node) as object), [name]: '' })}
                            onClick={() => editor.addValue(`${node.pointer}/${name}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
