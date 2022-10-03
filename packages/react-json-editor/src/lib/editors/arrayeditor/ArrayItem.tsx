import { Node } from 'headless-json-editor';
import { Button, Card, Icon, Popup, Grid, Segment } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';

export type ArrayItemProps = {
    instance: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    withDragHandle?: boolean;
};

export function ArrayItemGrid({ instance, node, withDragHandle, size }: ArrayItemProps) {
    const Editor = instance.getEditor(node);
    return (
        <Segment compact>
            <Grid data-type="array-item" key={node.id}>
                <Grid.Column width="15" key="item">
                    {withDragHandle && <Icon link name="expand arrows alternate" className="ed-array-item__handle" />}
                    <Editor instance={instance} node={node} options={{ title: undefined, description: undefined }} />
                </Grid.Column>
                <Grid.Column width="1" textAlign="right" key="actions">
                    <Popup trigger={<Icon link name="ellipsis vertical" />} flowing hoverable>
                        <ArrayItemActions instance={instance} node={node} size={size} />
                    </Popup>
                </Grid.Column>
            </Grid>
        </Segment>
    );
}

export function ArrayItemCard({ instance, node, withDragHandle, size }: ArrayItemProps) {
    const Editor = instance.getEditor(node);
    return (
        <Card fluid data-type="array-item" key={node.id}>
            <Card.Content key="header">
                {/*<Grid.Column width="15">{withDragHandle && <div className="ed-array-item__handle"></div>}</Grid.Column>*/}
                <Popup trigger={<Button link basic floated="right" icon="ellipsis vertical" />} flowing hoverable>
                    <ArrayItemActions instance={instance} node={node} size={size} />
                </Popup>
                <Card.Header>{node.options.title}</Card.Header>
                <Card.Meta>{node.options.description}</Card.Meta>
            </Card.Content>
            <Card.Content key="item">
                <Editor instance={instance} node={node} options={{ title: undefined, description: undefined }} />
            </Card.Content>
        </Card>
    );
}

export type ArrayItemActionProps = { node: Node; instance: JsonEditor; size: number };

export function ArrayItemActions({ node, instance, size }: ArrayItemActionProps) {
    return (
        <>
            <Button basic icon="trash alternate outline" onClick={() => instance.removeValue(node.pointer)} />
            <Button
                basic
                icon="caret up"
                disabled={node.property === '0'}
                onClick={() => instance.moveItem(node.pointer, parseInt(node.property) - 1)}
            />

            <Button
                basic
                icon="caret down"
                disabled={node.property === `${size - 1}`}
                onClick={() => instance.moveItem(node.pointer, parseInt(node.property) + 1)}
            />
        </>
    );
}
