import { Button, ButtonControlled } from '../../components/button/Button';
import { Popover, usePopover } from '../../components/popover/Popover';
import { Modal, useModal } from '../../components/modal/Modal';
import { Icon } from '../../components/icon/Icon';

export type Action = { icon: string; label?: string; enabled?: boolean; action: () => void };

export function ArrayWidgetActions({ editor, node, options, actions, portalContainer }) {
    const { isOptional, editJson = {} } = options;
    const { popoverTriggerProps, popoverProps } = usePopover({ placement: 'bottom end' });
    const { modalTriggerProps, modalProps } = useModal<HTMLButtonElement>();

    const listOfActions: React.ReactNode[] = [];
    if (isOptional) {
        listOfActions.push(
            <Button key="delete" variant="text" icon="delete" onPress={() => editor.removeValue(node.pointer)}>
                Remove Array
            </Button>
        );
    }

    if (editJson.enabled) {
        listOfActions.push(
            <ButtonControlled
                variant="text"
                key="editJson"
                className="clickable"
                icon="edit_note"
                {...modalTriggerProps}
            >
                Edit Json
            </ButtonControlled>
        );
    }

    listOfActions.push(...actions);

    return (
        <div ref={portalContainer}>
            <ButtonControlled {...popoverTriggerProps} variant="text" className="rje-widget-action">
                <Icon>menu</Icon>
            </ButtonControlled>
            <Popover {...popoverProps} portalContainer={portalContainer}>
                <div className="rje-widget-actions">{listOfActions}</div>
            </Popover>
            <Modal isDismissable={false} {...modalProps} portalContainer={portalContainer}>
                {(close) => (
                    <ModaContentWidget
                        editor={editor}
                        node={node}
                        options={{ modalSize: editJson.modalSize, ...options, widget: 'json' }}
                        closeModal={close}
                    />
                )}
            </Modal>
        </div>
    );
}

function ModaContentWidget({ editor, node, options, closeModal }) {
    const Widget = editor.getWidget(node, options);
    return (
        <>
            <div className="rje-form">
                <Widget node={node} editor={editor} options={{ ...options, title: undefined }} />
            </div>
            <div className="rje-modal--footer">
                <Button onPress={closeModal}>close</Button>
            </div>
        </>
    );
}
