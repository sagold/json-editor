import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { TextArea } from '../../components/textarea/TextArea';

export type TextOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
}>;

export const TextWidget = widget<StringNode<TextOptions>, string>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    return (
        <WidgetField widgetType="text" node={node} options={options}>
            <TextArea
                defaultValue={node.value}
                disabled={options.disabled || isValidConst}
                liveUpdate={options.liveUpdate}
                maxLength={node.schema.maxLength}
                minLength={node.schema.minLength}
                placeholder={options.placeholder}
                error={hasError}
                readOnly={options.readOnly === true}
                required={options.required === true}
                setValue={setValue}
                title={options.title}
                value={node.value}
            />
        </WidgetField>
    );
});

export const TextWidgetPlugin: WidgetPlugin = {
    id: 'text-widget',
    use: (node) =>
        node.schema.type === 'string' && (node.schema.format === 'html' || node.schema.format === 'textarea'),
    Widget: TextWidget
};
