import { StringNode, Node, json } from 'headless-json-editor';
import { Form, Dropdown, DropdownItemProps, Message } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';

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

export const MultiSelectEditor = editor<StringNode, string>(({ node, setValue }) => {
    const listData = json(node) as string[];
    // two modes: free strings or fixed enum
    let allowAdditions = true;
    let options: DropdownItemProps[];
    if (hasEnumOptions(node.schema.items)) {
        options = getEnumOptions(node);
        allowAdditions = false;
    } else {
        options = listData.map((value) => ({ value, text: value }));
    }

    return (
        <div data-type="string" className={node.options.disabled ? 'disabled' : 'enabled'}>
            <Form.Field id={node.pointer} error={node.errors.length > 0} disabled={node.options.disabled}>
                <label>{node.options.title as string}</label>
                <Dropdown
                    fluid
                    multiple
                    search
                    selection
                    allowAdditions={allowAdditions}
                    onChange={(e, { value }) => setValue(value as string)}
                    value={listData}
                    options={options}
                />
            </Form.Field>
            {node.errors.length > 0 && (
                <Message error>
                    {node.errors.map((e) => (
                        <Message.Item key={e.message}>{e.message}</Message.Item>
                    ))}
                </Message>
            )}
            {<div className="description">{node.options.description as string}</div>}
        </div>
    );
});

export function useMultiSelectEditor(node: Node) {
    return isArraySchema(node.schema) && node.schema.items.type === 'string';
}

export const MultiSelectEditorPlugin: EditorPlugin = {
    id: 'multi-select-editor',
    use: useMultiSelectEditor,
    Editor: MultiSelectEditor
};
