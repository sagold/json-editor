import { StringNode, Node, json } from '@sagold/headless-json-editor';
import { EditorPlugin } from '../types';
import { Form, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { valueEditor } from './decorators';

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

export const MultiSelectEditor = valueEditor<StringNode>(({ node, setValue }) => {
    const listData = json(node);
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
            <Form.Field
                id={node.pointer}
                error={node.errors.length > 0 && node.errors.map((e) => e.message)}
                disabled={node.options.disabled}
            >
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
