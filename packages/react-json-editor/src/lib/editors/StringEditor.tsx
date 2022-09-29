import { StringNode } from 'headless-json-editor';
import { Form, Dropdown } from 'semantic-ui-react';
import { editor, EditorPlugin } from './decorators';

export const StringEditor = editor<StringNode, string>(({ node, options, setValue }) => {
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    const disabled = options.disabled || isValidConst;

    return (
        <div data-type="string" data-id={node.pointer} className={disabled ? 'disabled' : 'enabled'}>
            <Form.Input
                id={node.id}
                type="text"
                disabled={disabled}
                value={node.value}
                error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
                label={options.title}
                onChange={(e, { value }) => setValue(value)}
            />
            {/*{node.errors.length > 0 && (
                <Message error>
                    <Message.List>
                        {node.errors.map((e) => {
                            return <Message.Item key={e.message}>{e.message}</Message.Item>;
                        })}
                    </Message.List>
                </Message>
            )}*/}
            {<div className="description">{options.description as string}</div>}
        </div>
    );
});

export const StringEditorPlugin: EditorPlugin = {
    id: 'string-editor',
    use: (node) => node.schema.type === 'string',
    Editor: StringEditor
};

export const SelectEditor = editor<StringNode, string>(({ node, options, setValue }) => {
    const enumValues = (node.schema.enum || []) as string[];

    const titles = (options.enum as string[]) ?? [];
    const selectOptions = enumValues.map((value, index) => ({
        key: index,
        value,
        text: titles[index] ?? value
    }));

    return (
        <div data-type="string">
            <Form.Field id={node.pointer} error={node.errors.length > 0 && node.errors.map((e) => e.message)}>
                <label>{options.title ?? node.property}</label>
                <Dropdown
                    selection
                    onChange={(event, { value }) => setValue(value as string)}
                    value={node.value}
                    options={selectOptions}
                />
            </Form.Field>
            {<div className="description">{options.description}</div>}
        </div>
    );
});
