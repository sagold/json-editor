import { StringNode } from '@sagold/react-json-editor';
import { Form, Dropdown } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '@sagold/react-json-editor';

export const SelectWidget = widget<StringNode, string>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];

    const titles = (options.enum as string[]) ?? [];
    const selectOptions = enumValues.map((value, index) => ({
        key: index,
        value,
        text: titles[index] ?? value
    }));

    return (
        <div className="rje-form rje-value" data-type="string">
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
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
    );
});

export const SelectWidgetPlugin: WidgetPlugin = {
    id: 'select-widget',
    use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
    Widget: SelectWidget
};
