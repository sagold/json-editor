import { StringNode, Node, json } from '@sagold/react-json-editor';
import { Form, Dropdown, DropdownItemProps, Message } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '@sagold/react-json-editor';

// @todo is building enum options job of syntax-tree?
// options format might is dependent on ui implementation
function getEnumOptions({ schema, options }) {
    return schema?.items?.enum.map((value, index) => ({
        key: value,
        value,
        text: options.enum?.[index] ?? value
    }));
}

function isArraySchema(schema): schema is { items: any } {
    return schema.type === 'array';
}

function hasEnumOptions(itemsSchema): itemsSchema is { enum: string[] } {
    return Array.isArray(itemsSchema?.enum);
}

export const MultiSelectWidget = widget<StringNode, string>(({ node, options, setValue }) => {
    const listData = json(node) as string[];
    // two modes: free strings or fixed enum
    let allowAdditions = true;
    let dropdownOptions: DropdownItemProps[];
    if (hasEnumOptions(node.schema.items)) {
        dropdownOptions = getEnumOptions(node);
        allowAdditions = false;
    } else {
        dropdownOptions = listData.map((value) => ({ value, text: value }));
    }

    return (
        <div
            className={`ed-form ed-value ${options.disabled ? 'disabled' : 'enabled'}`}
            data-type="string"
            data-id={node.pointer}
        >
            <Form.Field
                required={options.required === true}
                id={node.id}
                error={node.errors.length > 0}
                disabled={options.disabled}
            >
                <label>{options.title as string}</label>
                <Dropdown
                    allowAdditions={allowAdditions}
                    multiple
                    onChange={(e, { value }) => setValue(value as string)}
                    options={dropdownOptions}
                    readOnly={options.readOnly === true}
                    search
                    selection
                    value={listData}
                />
            </Form.Field>
            {node.errors.length > 0 && (
                <Message error>
                    {node.errors.map((e) => (
                        <Message.Item key={e.message}>{e.message}</Message.Item>
                    ))}
                </Message>
            )}
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export function useMultiSelectWidget(node: Node) {
    return isArraySchema(node.schema) && node.schema.items.type === 'string';
}

export const MultiSelectWidgetPlugin: WidgetPlugin = {
    id: 'multi-select-widget',
    use: useMultiSelectWidget,
    Widget: MultiSelectWidget
};
