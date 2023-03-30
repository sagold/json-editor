import { RefObject } from 'react';
import { JsonEditor, Widget, Node } from '@sagold/react-json-editor';
import { Button, ButtonControlled } from '../../components/button/Button';
import { Popover, usePopover } from '../../components/popover/Popover';
import classnames from 'classnames';

export type ArrayItemProps = {
    editor: JsonEditor;
    /** child node */
    node: Node;
    size: number;
    portalContainer: RefObject<Element>;
    withDragHandle?: boolean;
    disabled?: boolean;
    options?: Record<string, any>;
    /** set to true, if item can be deleted */
    optional?: boolean;
};

export function ArrayItemDefault({
    editor,
    node,
    withDragHandle,
    disabled,
    size,
    portalContainer,
    optional,
    options = {}
}: ArrayItemProps) {
    const { popoverTriggerProps, popoverProps } = usePopover({ placement: 'bottom end' });
    return (
        <div data-type="array-item" className={classnames('rje-array-item', { 'with-drag-handle': withDragHandle })}>
            {withDragHandle && <div className="rje-drag__handle rje-drag__container"></div>}
            <Widget editor={editor} node={node} options={options} />
            <div className={`rje-array-item__menu`}>
                <ButtonControlled {...popoverTriggerProps} variant="text" icon="more_vert" disabled={disabled} />
                <Popover {...popoverProps} portalContainer={portalContainer}>
                    <ArrayItemActions editor={editor} node={node} size={size} optional={optional} />
                </Popover>
            </div>
        </div>
    );
}

export type ArrayItemActionProps = { node: Node; editor: JsonEditor; size: number; optional?: boolean };

export function ArrayItemActions({ node, editor, size, optional }: ArrayItemActionProps) {
    return (
        <div className="rje-array-item__actions">
            <Button
                icon="delete"
                variant="text"
                disabled={optional === false}
                onPress={() => editor.removeValue(node.pointer)}
            />
            <Button
                icon="keyboard_arrow_up"
                variant="text"
                disabled={node.property === '0'}
                onPress={() => editor.moveItem(node.pointer, parseInt(node.property) - 1)}
            />

            <Button
                icon="keyboard_arrow_down"
                variant="text"
                disabled={node.property === `${size - 1}`}
                onPress={() => editor.moveItem(node.pointer, parseInt(node.property) + 1)}
            />
        </div>
    );
}
