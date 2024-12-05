import { useEffect, useState } from 'react';
import {
    widget,
    WidgetPlugin,
    StringNode,
    ParentNode,
    getData,
    JsonError,
    DefaultNodeOptions,
    getErrors,
    WidgetField,
    Node
} from '@sagold/react-json-editor';
import { Textarea } from '@mantine/core';
import { Description } from '../components/Description';

const invalidJsonError: JsonError = {
    type: 'error',
    name: 'InvalidJsonError',
    code: 'invalid-json-error',
    message: 'Invalid json format',
    data: {
        pointer: '#',
        value: {},
        schema: {}
    }
} as const;

export type SimpleJsonOptions = DefaultNodeOptions;

export const SimpleJsonWidget = (props) => {
    const node = props!.node as Node;
    if (node.schema.type === 'string') {
        return <SimpleJsonStringWidget {...props} />;
    }
    return <SimpleJsonDataWidget {...props} />;
};

export const SimpleJsonStringWidget = widget<StringNode<SimpleJsonOptions>, string>(({ node, options, setValue }) => {
    const [error, setError] = useState<JsonError | undefined>(undefined);
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    let defaultValue = node.value ?? '';
    try {
        defaultValue = JSON.stringify(JSON.parse(defaultValue), null, 2);
    } catch (e) {
        /* ignore */
    }
    const [internalValue, setInternalValue] = useState(defaultValue);

    let errors = node.errors.map((e) => e.message).join('\n');
    if (error) {
        errors = `${error.message}${node.errors.length ? `\n${node.errors.map((e) => e.message).join('\n')}` : ''}`;
    }

    return (
        <WidgetField widgetType="simple-json" node={node} options={options} showError={false} showDescription={false}>
            <Textarea
                id={node.id}
                // classNames={{ section: styles['section__icon'] }}
                // leftSection={leftSection}
                // rightSection={rightSection}
                autosize
                value={internalValue}
                description={<Description text={options.description} />}
                disabled={options.disabled || isValidConst}
                error={errors}
                label={options.title}
                maxLength={node.schema.maxLength}
                minLength={node.schema.minLength}
                placeholder={options.placeholder}
                readOnly={options.readOnly === true}
                required={options.required}
                rows={1}
                maxRows={20}
                withAsterisk={options.required}
                onChange={(e) => setInternalValue(e.currentTarget.value)}
                onBlur={() => {
                    let value = internalValue;
                    try {
                        const data = JSON.parse(internalValue);
                        value = JSON.stringify(data, null, 2);
                        setInternalValue(value);
                        setError(undefined);
                    } catch (e) {
                        setError(invalidJsonError);
                    }
                    setValue(value);
                }}
            />
        </WidgetField>
    );
});

export const SimpleJsonDataWidget = widget<ParentNode<SimpleJsonOptions>, string>(
    ({ editor, node, options, setValue }) => {
        const nodeValueString = JSON.stringify(getData(node), null, 2);
        const [internalValue, setInternalValue] = useState(nodeValueString);
        useEffect(() => {
            setInternalValue(nodeValueString);
        }, [setInternalValue, nodeValueString]);

        const [error, setError] = useState<JsonError | undefined>();
        const jsonErrors = getErrors(node);
        let errors = jsonErrors.map((e) => e.message).join('\n');
        if (error) {
            errors = `${error.message}${node.errors.length ? `\n${node.errors.map((e) => e.message).join('\n')}` : ''}`;
        }

        const isValidConst = node.schema.const != null && node.errors.length === 0;

        return (
            <WidgetField
                widgetType="simple-json"
                node={node}
                options={options}
                errors={jsonErrors}
                additionalError={error}
                showDescription={false}
                showError={false}
            >
                <Textarea
                    id={node.id}
                    autosize
                    value={internalValue}
                    description={<Description text={options.description} />}
                    disabled={options.disabled || isValidConst}
                    error={errors}
                    label={options.title}
                    maxLength={node.schema.maxLength}
                    minLength={node.schema.minLength}
                    placeholder={options.placeholder}
                    readOnly={options.readOnly === true}
                    required={options.required}
                    rows={1}
                    maxRows={20}
                    withAsterisk={options.required}
                    onChange={(e) => setInternalValue(e.currentTarget.value)}
                    onBlur={() => {
                        try {
                            const data = editor.getTemplateData(node.schema, JSON.parse(internalValue));
                            setInternalValue(JSON.stringify(data, null, 2));
                            setValue(data);
                            setError(undefined);
                        } catch (e) {
                            console.log('failed parsing value', internalValue);
                            setError(invalidJsonError);
                        }
                    }}
                />
            </WidgetField>
        );
    }
);

export const SimpleJsonWidgetPlugin: WidgetPlugin = {
    id: 'simple-json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: SimpleJsonWidget
};
