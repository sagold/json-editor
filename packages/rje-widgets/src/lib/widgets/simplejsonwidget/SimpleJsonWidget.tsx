import { StringNode, ParentNode, json } from '@sagold/react-json-editor';
import { Form } from 'semantic-ui-react';
import { widget, WidgetPlugin } from '@sagold/react-json-editor';
import TextareaAutosize from 'react-textarea-autosize';
import { useState } from 'react';

export const SimpleJsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return <SimpleJsonStringWidget {...props} />;
    }
    return <SimpleJsonDataWidget {...props} />;
};

export const SimpleJsonStringWidget = widget<StringNode, string>(({ node, options, setValue }) => {
    let value = node.value;
    if (value) {
        try {
            value = JSON.stringify(JSON.parse(value), null, 2);
        } catch (e) {
            // @ts-ignore
        }
    }

    return (
        <div
            className={`rje-form rje-value ${options.disabled ? 'disabled' : 'enabled'}`}
            data-type={node.type}
            data-id={node.pointer}
        >
            <Form.Field
                disabled={options.disabled === true}
                control={TextareaAutosize}
                id={node.id}
                rows={1}
                required={options.required === true}
                readOnly={options.readOnly === true}
                minRows={10}
                maxRows={40}
                cacheMeasurements
                defaultValue={value}
                error={node.errors.length === 0 ? false : { content: node.errors.map((e) => e.message).join(';') }}
                label={options.title}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            ></Form.Field>
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
    );
});

export const SimpleJsonDataWidget = widget<ParentNode, string>(({ node, options, setValue }) => {
    const value = json(node);
    const [error, setError] = useState(false);

    return (
        <div
            className={`rje-form rje-value ${options.disabled ? 'disabled' : 'enabled'}`}
            data-type={node.type}
            data-id={node.pointer}
        >
            <Form.Field
                disabled={options.disabled === true}
                control={TextareaAutosize}
                id={node.id}
                rows={1}
                required={options.required === true}
                readOnly={options.readOnly === true}
                minRows={10}
                maxRows={40}
                cacheMeasurements
                defaultValue={JSON.stringify(value, null, 2)}
                error={error ? { content: 'Invalid json format' } : false}
                label={options.title}
                onChange={(e) => {
                    try {
                        setValue(JSON.parse(e.target.value));
                        setError(false);
                    } catch (e) {
                        setError(true);
                    }
                }}
            ></Form.Field>
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
    );
});

export const SimpleJsonWidgetPlugin: WidgetPlugin = {
    id: 'simple-json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: SimpleJsonWidget
};
