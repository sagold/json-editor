import { Node } from 'headless-json-editor';
import { Button, Card, Popup, Icon } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';

export type ArrayItemProps = {
    instance: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    withDragHandle?: boolean;
};

export function ArrayItemDefault({ instance, node, withDragHandle, size }: ArrayItemProps) {
    const Widget = instance.getWidget(node);
    return (
        <div data-type="array-item" className={withDragHandle ? 'with-drag-handle' : ''}>
            {withDragHandle && (
                <div className="ed-drag__handle ed-drag__container">
                    <Icon name="ellipsis vertical" />
                    <Icon name="ellipsis vertical" />
                </div>
            )}
            <div className="ed-array-item__actions">
                <Popup trigger={<Button basic icon="ellipsis vertical" />} flowing hoverable>
                    <ArrayItemActions instance={instance} node={node} size={size} />
                </Popup>
            </div>
            <Widget instance={instance} node={node} options={{ title: undefined, description: undefined }} />
            {size - 1 > parseInt(node.property) && <div className="ed-array-item__divider" />}
        </div>
    );
}

export function ArrayItemCard({ instance, node, withDragHandle, size }: ArrayItemProps) {
    const Widget = instance.getWidget(node);
    return (
        <Card fluid data-type="array-item" key={node.id} className={withDragHandle ? 'with-drag-handle' : ''}>
            <Card.Content key="header" className={withDragHandle ? 'ed-drag__handle' : ''}>
                {/*<Grid.Column width="15">{withDragHandle && <div className="ed-array-item__handle"></div>}</Grid.Column>*/}
                <Popup trigger={<Button basic floated="right" icon="ellipsis vertical" />} flowing hoverable>
                    <ArrayItemActions instance={instance} node={node} size={size} />
                </Popup>
                <Card.Header>{node.options.title}</Card.Header>
                <Card.Meta>{node.options.description}</Card.Meta>
            </Card.Content>
            <Card.Content key="item">
                <Widget instance={instance} node={node} options={{ title: undefined, description: undefined }} />
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
