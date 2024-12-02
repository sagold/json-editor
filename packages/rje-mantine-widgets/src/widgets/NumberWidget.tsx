import { widget, WidgetPlugin, DefaultNodeOptions, WidgetField, NumberNode } from '@sagold/react-json-editor';
import { NumberInput } from '@mantine/core';
import { ReactNode } from 'react';
import { Icon } from '../components/icon/Icon';

export type NumberOptions = DefaultNodeOptions<{
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    icon?: string;
    tag?: string;
    swapIconPosition?: boolean;
}>;

export const NumberWidget = widget<NumberNode<NumberOptions>, number>(({ node, options, setValue }) => {
    const hasError = node.errors.length > 0;
    const isValidConst = node.schema.const != null && !hasError;
    const type = node.schema.format === 'password' ? 'password' : 'text';
    let leftSection: ReactNode;
    let rightSection: ReactNode;
    if (options.icon) {
        if (options.swapIconPosition) {
            rightSection = <Icon>{options.icon}</Icon>;
        } else {
            leftSection = <Icon>{options.icon}</Icon>;
        }
    }
    if (options.tag) {
        if (!options.swapIconPosition) {
            rightSection = <span>{options.tag}</span>;
        } else {
            leftSection = <span>{options.tag}</span>;
        }
    }

    return (
        <WidgetField widgetType="string" node={node} options={options} showDescription={false} showError={false}>
            <NumberInput
                id={node.id}
                leftSection={leftSection}
                rightSection={rightSection}
                label={options.title}
                type={type}
                value={node.value}
                error={node.errors.map((e) => e.message).join('\n')}
                readOnly={options.readOnly}
                required={options.required}
                withAsterisk={options.required}
                placeholder={options.placeholder}
                description={options.description}
                // emitOnChange={options.liveUpdate}
                onChange={(value) => setValue(+value)}
                disabled={options.disabled || isValidConst}
            />
        </WidgetField>
    );
});

export const NumberWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'number',
    Widget: NumberWidget
};
