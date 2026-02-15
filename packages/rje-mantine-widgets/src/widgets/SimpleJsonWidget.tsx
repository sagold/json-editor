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
import { widgetInputProps } from '../components/widgetInputProps';
import { WidgetMenuItems } from '../components/widgetmenu/WidgetMenu';

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

export type SimpleJsonOptions = {
    /** if false, will hide title. will hide complete title-header if no menu-actions are available */
    showHeader?: boolean;
    /** internal option for menu action items */
    widgetMenuItems?: WidgetMenuItems;
} & DefaultNodeOptions;

export const SimpleJsonWidget = (props: any) => {
    const node = props!.node as Node;
    if (node.schema.type === 'string') {
        return <SimpleJsonStringWidget {...props} />;
    }
    return <SimpleJsonDataWidget {...props} />;
};

export const SimpleJsonStringWidget = widget<StringNode<SimpleJsonOptions>, string>(({ node, options, setValue }) => {
    const [error, setError] = useState<JsonError | undefined>(undefined);
    const [internalValue, setInternalValue] = useState(node.value ?? '');
    useEffect(() => {
        let value = node.value ?? '';
        try {
            value = JSON.stringify(JSON.parse(value), null, 2);
        } catch {
            /* ignore */
        }
        setInternalValue(value);
    }, [setInternalValue, node.value]);

    let errors = node.errors.map((error) => error.message).join('\n');
    if (error) {
        errors = `${error.message}${node.errors.length ? `\n${node.errors.map((e) => e.message).join('\n')}` : ''}`;
    }

    return (
        <WidgetField widgetType="simple-json" node={node} options={options} showError={false} showDescription={false}>
            <Textarea
                {...widgetInputProps(node, options)}
                autosize
                error={errors}
                maxLength={node.schema.maxLength}
                minLength={node.schema.minLength}
                rows={1}
                maxRows={20}
                onChange={(e) => setInternalValue(e.currentTarget.value)}
                onBlur={() => {
                    let value = internalValue;
                    try {
                        const data = JSON.parse(internalValue);
                        value = JSON.stringify(data, null, 2);
                        setInternalValue(value);
                        setError(undefined);
                    } catch {
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
                    {...widgetInputProps(node, options)}
                    autosize
                    value={internalValue}
                    error={errors}
                    maxLength={node.schema.maxLength}
                    minLength={node.schema.minLength}
                    rows={1}
                    maxRows={20}
                    onChange={(e) => setInternalValue(e.currentTarget.value)}
                    onBlur={() => {
                        try {
                            const data = editor.getTemplateData(node.schema, JSON.parse(internalValue)) as string;
                            setInternalValue(JSON.stringify(data, null, 2));
                            setValue(data);
                            setError(undefined);
                        } catch {
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
