import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { Form, Dropdown, SemanticICONS } from 'semantic-ui-react';
import { widget, WidgetPlugin } from './decorators';

export type StringOptions = {
    icon?: SemanticICONS;
    iconPosition?: 'left';
    inline?: true;
    // label?: SemanticShorthandItem<LabelProps>;
    // labelPosition?: 'left' | 'right' | 'right corner' | 'left corner';
} & DefaultNodeOptions;

export const StringWidget = widget<StringNode<StringOptions>, string>(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;

    return (
        <div
            className={`ed-form ed-value ${disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Input
                id={node.id}
                type="text"
                disabled={disabled}
                required={options.required === true}
                error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
                icon={options.icon}
                iconPosition={options.iconPosition}
                inline={options.inline === true}
                label={options.title}
                placeholder={options.placeholder}
                readOnly={options.readOnly === true}
                value={node.value}
                onChange={(e, { value }) => setValue(value)}
            />
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const StringWidgetPlugin: WidgetPlugin = {
    id: 'string-widget',
    use: (node) => node.schema.type === 'string',
    Widget: StringWidget
};

export const SelectWidget = widget<StringNode, string>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];

    const titles = (options.enum as string[]) ?? [];
    const selectOptions = enumValues.map((value, index) => ({
        key: index,
        value,
        text: titles[index] ?? value
    }));

    return (
        <div className="ed-form ed-value" data-type="string">
            <Form.Field
                required={options.required === true}
                id={node.pointer}
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
            >
                <label>{options.title ?? node.property}</label>
                <Dropdown
                    selection
                    onChange={(event, { value }) => setValue(value as string)}
                    value={node.value}
                    options={selectOptions}
                />
            </Form.Field>
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});
