import { ActionIcon, Divider, Flex, Popover, Select } from '@mantine/core';
import {
    widget,
    WidgetPlugin,
    Widget,
    JsonSchema,
    ValueNode,
    DefaultNodeOptions,
    WidgetField
} from '@sagold/react-json-editor';
import { Icon } from '../components/icon/Icon';
import { Description } from '../components/Description';

export type OneOfOptions = {
    /** header font size relative to 1 (em). Defaults to 1 */
    headerFontSize?: number;
    descriptionInline?: boolean;
} & DefaultNodeOptions;

export function useOneOfSelectWidget(node, { skipSelectOneOf = false } = {}) {
    const chooseThisWidget = !skipSelectOneOf && !node.isArrayItem && Array.isArray(node.sourceSchema?.oneOf);
    return chooseThisWidget;
}

export const OneOfSelectWidget = widget<ValueNode<OneOfOptions>>(({ editor, node, options }) => {
    // @ts-expect-error inconsitent types or logic?
    const origin = { schema: node.sourceSchema, index: node.oneOfIndex ?? 0 };
    const oneOf = origin.schema.oneOf as JsonSchema[];
    if (!Array.isArray(oneOf)) {
        console.error('Error in SelectOneOfWidget: Expected oneOfOrigin to contain schema');
        return null;
    }

    const onChange = (value) => {
        const oneOfSchema = oneOf[`${value}`];
        const data = editor.getTemplateData(oneOfSchema);
        editor.setValue(node.pointer, data);
    };

    return (
        <WidgetField widgetType="oneof" node={node} options={options} showDescription={false} showError={false}>
            <Divider
                my="md"
                labelPosition={'left'}
                label={
                    <Flex gap={8} align={'center'}>
                        <Select
                            id={node.id}
                            data={oneOf.map((schema, index) => ({
                                value: `${index}`,
                                label: schema.title ?? `${index}`
                            }))}
                            // description={options.description}
                            disabled={options.disabled}
                            error={node.errors.map((e) => e.message).join('\n')}
                            onChange={onChange}
                            placeholder={options.placeholder}
                            required={options.required}
                            value={`${origin.index}`}
                        />
                        {options.description && options.description.length > 0 && (
                            <Popover position="top" withArrow shadow="md">
                                <Popover.Target>
                                    <ActionIcon radius={'xl'} variant="transparent">
                                        <Icon>info</Icon>
                                    </ActionIcon>
                                </Popover.Target>
                                <Popover.Dropdown style={{ maxWidth: '80%' }}>
                                    <Description text={options.description} />
                                </Popover.Dropdown>
                            </Popover>
                        )}
                    </Flex>
                }
            />
            <div className="rje-children">
                <Widget
                    node={node}
                    editor={editor}
                    options={{ title: undefined, description: undefined, skipSelectOneOf: true }}
                />
            </div>
        </WidgetField>
    );
});

export const OneOfSelectWidgetPlugin: WidgetPlugin = {
    id: 'oneof-select-widget',
    use: useOneOfSelectWidget,
    Widget: OneOfSelectWidget
};
