import { widget, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';
import { StringInput } from '../../components/input/StringInput';
import { WidgetField } from '../../components/widgetfield/WidgetField';

export type StringOptions = {
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
} & DefaultNodeOptions;

export const StringWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    const type = node.schema.format === 'password' ? 'password' : 'text';

    return (
        <WidgetField widgetType="string" node={node} options={options}>
            <StringInput
                id={node.id}
                icon={options.icon}
                tag={options.tag}
                title={options.title}
                type={type}
                value={node.value}
                iconPosition={options.swapIconPosition ? 'right' : 'left'}
                error={hasError}
                readOnly={options.readOnly}
                required={options.required}
                placeholder={options.placeholder}
                emitOnChange={options.liveUpdate}
                onPress={setValue}
                disabled={options.disabled || isValidConst}
            />
        </WidgetField>
    );
});

export const StringWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'string',
    Widget: StringWidget
};
