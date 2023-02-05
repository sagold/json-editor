import { Button, Card, Popup, Icon } from 'semantic-ui-react';
import { JsonEditor, Widget, Node } from '@sagold/react-json-editor';

export type ArrayItemProps = {
    editor: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    withDragHandle?: boolean;
    disabled?: boolean;
    options?: Record<string, any>;
    /** if item can be deleted */
    optional?: boolean;
};

export function ArrayItemDefault({
    editor,
    node,
    withDragHandle,
    disabled,
    size,
    optional,
    options = {}
}: ArrayItemProps) {
    return (
        <div data-type="array-item" className={['array-item', withDragHandle ? 'with-drag-handle' : ''].join(' ')}>
            {withDragHandle && <div className="rje-drag__handle rje-drag__container"></div>}
            <Widget editor={editor} node={node} options={options} />
            <div className={`rje-array-item__actions`}>
                <Popup trigger={<Button basic icon="ellipsis vertical" />} flowing hoverable disabled={disabled}>
                    <ArrayItemActions editor={editor} node={node} size={size} optional={optional} />
                </Popup>
            </div>
            {/*{size - 1 > parseInt(node.property) && <div className="rje-array-item__divider" />}*/}
        </div>
    );
}

export function ArrayItemCard({
    editor,
    node,
    withDragHandle,
    disabled,
    size,
    optional,
    options = {}
}: ArrayItemProps) {
    options.title = undefined;
    options.description = undefined;

    return (
        <Card fluid data-type="array-item" key={node.id} className={withDragHandle ? 'with-drag-handle' : ''}>
            <Card.Content key="header" className={withDragHandle ? 'rje-drag__handle' : ''}>
                {/*<Grid.Column width="15">{withDragHandle && <div className="rje-array-item__handle"></div>}</Grid.Column>*/}
                <Popup
                    trigger={<Button basic floated="right" icon="ellipsis vertical" />}
                    disabled={disabled}
                    flowing
                    hoverable
                >
                    <ArrayItemActions editor={editor} node={node} size={size} optional={optional} />
                </Popup>
                <Card.Header>{node.options.title}</Card.Header>
                <Card.Meta>{node.options.description}</Card.Meta>
            </Card.Content>
            <Card.Content key="item">
                <Widget editor={editor} node={node} options={options} />
            </Card.Content>
        </Card>
    );
}

export type ArrayItemActionProps = { node: Node; editor: JsonEditor; size: number; optional?: boolean };

export function ArrayItemActions({ node, editor, size, optional }: ArrayItemActionProps) {
    return (
        <>
            <Button
                basic
                disabled={optional === false}
                icon="trash alternate outline"
                onClick={() => editor.removeValue(node.pointer)}
            />
            <Button
                basic
                icon="caret up"
                disabled={node.property === '0'}
                onClick={() => editor.moveItem(node.pointer, parseInt(node.property) - 1)}
            />

            <Button
                basic
                icon="caret down"
                disabled={node.property === `${size - 1}`}
                onClick={() => editor.moveItem(node.pointer, parseInt(node.property) + 1)}
            />
        </>
    );
}
