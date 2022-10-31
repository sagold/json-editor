import { Node } from 'headless-json-editor';
import { Button, Card, Popup, Icon } from 'semantic-ui-react';
import { JsonEditor } from '../../JsonEditor';
import { Widget } from '../../components/widget/Widget';

export type ArrayItemProps = {
    editor: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    withDragHandle?: boolean;
    disabled?: boolean;
    options?: Record<string, any>;
};

export function ArrayItemDefault({ editor, node, withDragHandle, disabled, size, options = {} }: ArrayItemProps) {
    options.title = undefined;
    options.description = undefined;

    return (
        <div data-type="array-item" className={withDragHandle ? 'with-drag-handle' : ''}>
            {withDragHandle && (
                <div className="ed-drag__handle ed-drag__container">
                    <Icon name="bars" />
                </div>
            )}
            <div className="ed-array-item__actions">
                <Popup trigger={<Button basic icon="ellipsis vertical" />} flowing hoverable disabled={disabled}>
                    <ArrayItemActions editor={editor} node={node} size={size} />
                </Popup>
            </div>
            <Widget editor={editor} node={node} options={options} />
            {size - 1 > parseInt(node.property) && <div className="ed-array-item__divider" />}
        </div>
    );
}

export function ArrayItemCard({ editor, node, withDragHandle, disabled, size, options = {} }: ArrayItemProps) {
    options.title = undefined;
    options.description = undefined;

    return (
        <Card fluid data-type="array-item" key={node.id} className={withDragHandle ? 'with-drag-handle' : ''}>
            <Card.Content key="header" className={withDragHandle ? 'ed-drag__handle' : ''}>
                {/*<Grid.Column width="15">{withDragHandle && <div className="ed-array-item__handle"></div>}</Grid.Column>*/}
                <Popup
                    trigger={<Button basic floated="right" icon="ellipsis vertical" />}
                    disabled={disabled}
                    flowing
                    hoverable
                >
                    <ArrayItemActions editor={editor} node={node} size={size} />
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

export type ArrayItemActionProps = { node: Node; editor: JsonEditor; size: number };

export function ArrayItemActions({ node, editor, size }: ArrayItemActionProps) {
    return (
        <>
            <Button basic icon="trash alternate outline" onClick={() => editor.removeValue(node.pointer)} />
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
