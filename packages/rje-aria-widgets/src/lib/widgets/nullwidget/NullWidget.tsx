import { DefaultNodeOptions, NullNode, widget, WidgetPlugin } from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { SectionHeader } from '../../components/sectionheader/SectionHeader';

export type NullOptions = {
    /** if true, shows a separator line */
    separator?: boolean;
    /** if true, shows descriptions inline, defaults to false resulting in a tooltip display */
    descriptionInline?: boolean;
    /** title font size relative to 1 (em). Defaults to 1 */
    fontSize?: number;
} & DefaultNodeOptions;

export const NullWidget = widget<NullNode<NullOptions>, null>(({ node, options }) => {
    return (
        <WidgetField
            widgetType="null"
            node={node}
            options={options}
            showDescription={options.descriptionInline === true}
        >
            <SectionHeader>
                <SectionHeader.Label
                    title={options.title}
                    size={options.fontSize}
                    separator={options.separator === true}
                    description={options.descriptionInline !== true ? options.description : undefined}
                />
            </SectionHeader>
        </WidgetField>
    );
});

export const NullWidgetPlugin: WidgetPlugin = {
    id: 'null-widget',
    use: (node) => node.schema.type === 'null',
    Widget: NullWidget
};
