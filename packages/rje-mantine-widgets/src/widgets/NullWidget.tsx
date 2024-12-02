import { Divider } from '@mantine/core';
import { DefaultNodeOptions, NullNode, widget, WidgetField, WidgetPlugin } from '@sagold/react-json-editor';

export type NullOptions = {
    /** if true, shows a separator line */
    separator?: boolean;
    /** if true, shows descriptions inline, defaults to false resulting in a tooltip display */
    descriptionInline?: boolean;
    /** title font size relative to 1 (em). Defaults to 1 */
    fontSize?: number;
    titlePosition?: 'left' | 'center' | 'right';
} & DefaultNodeOptions;

export const NullWidget = widget<NullNode<NullOptions>, null>(({ node, options }) => {
    return (
        <WidgetField
            widgetType="null"
            node={node}
            options={options}
            showDescription={options.descriptionInline === true}
        >
            <Divider
                my="md"
                labelPosition={options.titlePosition ?? 'left'}
                label={
                    !options.title && !options.description ? undefined : (
                        <>
                            {options.title} - {options.description}
                        </>
                    )
                }
            />
        </WidgetField>
    );
});

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
