import { ActionIcon, Button, Collapse, DividerProps, Flex, Group, Menu, Modal, Stack, TitleProps } from '@mantine/core';
import {
    DefaultNodeOptions,
    ObjectNode,
    Widget,
    WidgetField,
    WidgetPlugin,
    Node,
    widget
} from '@sagold/react-json-editor';
import { Icon } from '../../components/icon/Icon';
import { WidgetInputWrapper } from '../../components/widgetinputwrapper/WidgetInputWrapper';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

export type ObjectOptions = DefaultNodeOptions<{
    /** if set, will add an accordion in the given toggle state */
    collapsed?: boolean;
    /** if set, will add an edit-json action to edit, copy and paste json-data for this location */
    showEditJsonAction?: boolean;
    /** Is set internally to true to add a delete option for this object. */
    isOptional?: boolean;
    /** set to true to show inline button at the end of the array to add another item */
    showInlineAddAction?: boolean;
    /** set to false to deactivate array menu */
    showHeaderMenu?: boolean;
    /** set to false to deactivate any array item-controls */
    showItemControls?: boolean;
    /** set to true to inline description */
    descriptionInline?: boolean;
    /** if true will add a separator line to the header */
    showTitleDivider?: boolean;
    /** placement of title within the separator */
    dividerProps?: Pick<DividerProps, 'labelPosition' | 'color'>;
    /** Mantine Title Props */
    titleProps?: TitleProps;
}>;

export const ObjectWidget = widget<ObjectNode<ObjectOptions>>(({ node, options, editor }) => {
    const depth = node.pointer.split('/').length;
    const order = depth === 1 ? 1 : 2;
    const childOptions = {
        titleProps: {
            order: Math.min(6, order + 1)
        },
        disabled: options.disabled,
        readOnly: options.readOnly
    };
    const [contentOpened, contentToggle] = useDisclosure(!(options.collapsed ?? false));
    const [isJsonModalOpen, jsonModal] = useDisclosure(false);

    const headerMenuActions: ReactNode[] = [];
    if (options.showEditJsonAction == true) {
        headerMenuActions.push(
            <Menu.Item leftSection={<Icon>edit</Icon>} onClick={jsonModal.open}>
                edit Json
            </Menu.Item>
        );
    }

    if (editor.optionalProperties && node.optionalProperties.length > 0) {
        const actions = node.optionalProperties.map((property) => {
            const isMissing = node.missingProperties.includes(property);
            return (
                <Menu.Item
                    closeMenuOnClick={false}
                    disabled={options.disabled || options.readOnly}
                    leftSection={<Icon>{isMissing ? 'add' : 'close'}</Icon>}
                    key={property}
                    onClick={() => {
                        if (isMissing) {
                            editor.addValue(`${node.pointer}/${property}`);
                        } else {
                            editor.removeValue(`${node.pointer}/${property}`);
                        }
                    }}
                >
                    {property}
                </Menu.Item>
            );
        });
        if (headerMenuActions.length > 0) {
            headerMenuActions.push(<Menu.Divider />);
        }
        headerMenuActions.push(...actions);
    }

    const properties = node.children.map((child) => (
        <Flex key={child.id} className="rje-object__property" style={{ position: 'relative' }}>
            <Widget
                key={child.id}
                node={child}
                editor={editor}
                options={{
                    ...childOptions,
                    isOptional: node.optionalProperties.includes(child.property)
                }}
            />
            {options.showItemControls !== false &&
                editor.optionalProperties &&
                node.optionalProperties.includes(child.property) && (
                    <div
                        className="rje-object__actions"
                        style={
                            hasTitle(child)
                                ? {
                                      position: 'absolute',
                                      // mantine td padding:
                                      top: 'var(--table-vertical-spacing)',
                                      right: 0
                                  }
                                : {}
                        }
                    >
                        <ActionIcon variant="transparent" onClick={() => editor.removeValue(child.pointer)}>
                            <Icon>close</Icon>
                        </ActionIcon>
                    </div>
                )}
            <Modal title={options.title} opened={isJsonModalOpen} onClose={jsonModal.close} size={'xl'}>
                <Widget node={node} editor={editor} options={{ ...options, widget: 'json', title: '' }} />
                <Group justify="flex-end" mt={'md'}>
                    <Button variant="transparent" onClick={jsonModal.close}>
                        close
                    </Button>
                </Group>
            </Modal>
        </Flex>
    ));

    return (
        <WidgetField widgetType="object" node={node} options={options} showError={false} showDescription={false}>
            <WidgetInputWrapper
                options={options}
                errors={node.errors}
                leftSection={
                    options.collapsed != null && (
                        <ActionIcon
                            variant="transparent"
                            aria-label="actions"
                            color={'gray'}
                            onClick={() => contentToggle.toggle()}
                        >
                            <Icon>{contentOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
                        </ActionIcon>
                    )
                }
                rightSection={
                    options.showHeaderMenu !== false &&
                    headerMenuActions.length > 0 && (
                        <Menu>
                            <Menu.Target>
                                <ActionIcon
                                    variant="transparent"
                                    aria-label="actions"
                                    // @todo option
                                    color={'gray'}
                                    disabled={options.readOnly || options.disabled}
                                >
                                    <Icon>menu</Icon>
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>{headerMenuActions}</Menu.Dropdown>
                        </Menu>
                    )
                }
            >
                <Collapse in={contentOpened}>
                    <Stack gap={8} className="rje-object__properties">
                        {properties}
                    </Stack>
                    {options.showInlineAddAction !== false && node.missingProperties.length > 0 && (
                        <>
                            <Flex
                                className="rje-object__missing-properties"
                                style={{ alignItems: 'center' }}
                                wrap={'wrap'}
                            >
                                {node.missingProperties.map((name) => (
                                    <Button
                                        key={name}
                                        variant="subtle"
                                        disabled={options.readOnly || options.disabled}
                                        // color="gray"
                                        leftSection={<Icon>add</Icon>}
                                        onClick={() => editor.addValue(`${node.pointer}/${name}`)}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </Flex>
                        </>
                    )}
                </Collapse>
            </WidgetInputWrapper>
        </WidgetField>
    );
});

function hasTitle(child: Node) {
    return (child.options.title?.length ?? 0) > 0;
}

export const ObjectWidgetPlugin: WidgetPlugin = {
    id: 'object-widget',
    use: (node) => node.schema.type === 'object',
    Widget: ObjectWidget
};
