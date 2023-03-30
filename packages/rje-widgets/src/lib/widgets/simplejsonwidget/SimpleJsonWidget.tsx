import { useState } from 'react';
import {
    widget,
    WidgetPlugin,
    StringNode,
    ParentNode,
    json,
    JsonError,
    DefaultNodeOptions
} from '@sagold/react-json-editor';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { TextArea } from '../../components/textarea/TextArea';

const invalidJsonError: JsonError = {
    type: 'error',
    name: 'InvalidJsonError',
    code: 'invalid-json-error',
    message: 'Invalid json format'
} as const;

export type SimpleJsonOptions = {} & DefaultNodeOptions;

export const SimpleJsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return <SimpleJsonStringWidget {...props} />;
    }
    return <SimpleJsonDataWidget {...props} />;
};

export const SimpleJsonStringWidget = widget<StringNode<SimpleJsonOptions>, string>(({ node, options, setValue }) => {
    const [error, setError] = useState<JsonError | undefined>();
    let value = node.value;
    if (value) {
        try {
            value = JSON.stringify(JSON.parse(value), null, 2);
        } catch (e) {
            // @ts-ignore
        }
    }

    const isValidConst = node.schema.const != null && node.errors.length === 0;
    return (
        <WidgetField widgetType="simple-json" node={node} options={options} additionalError={error}>
            <TextArea
                defaultValue={node.value}
                disabled={options.disabled || isValidConst}
                liveUpdate={false}
                maxLength={node.schema.maxLength}
                minLength={node.schema.minLength}
                placeholder={options.placeholder}
                readOnly={options.readOnly === true}
                required={options.required === true}
                setValue={(value: string) => {
                    try {
                        const data = JSON.parse(value);
                        if (options.liveUpdate === false) {
                            // format
                            value = JSON.stringify(data, null, 2);
                        }
                        setError(undefined);
                        setValue(value);
                    } catch (e) {
                        setError(invalidJsonError);
                        setValue(value);
                    }
                }}
                title={options.title}
                value={node.value}
                rows={1}
                minRows={10}
                maxRows={40}
            />
        </WidgetField>
    );
});

export const SimpleJsonDataWidget = widget<ParentNode<SimpleJsonOptions>, string>(({ node, options, setValue }) => {
    const value = json(node);
    const valueString = JSON.stringify(value, null, 2);
    const [error, setError] = useState<JsonError | undefined>();
    const isValidConst = node.schema.const != null && node.errors.length === 0;
    return (
        <WidgetField widgetType="simple-json" node={node} options={options} additionalError={error}>
            <TextArea
                defaultValue={valueString}
                disabled={options.disabled || isValidConst}
                maxLength={node.schema.maxLength}
                minLength={node.schema.minLength}
                placeholder={options.placeholder}
                liveUpdate={false}
                readOnly={options.readOnly === true}
                required={options.required === true}
                setValue={(value: string) => {
                    try {
                        setValue(JSON.parse(value));
                        setError(undefined);
                    } catch (e) {
                        setError(invalidJsonError);
                    }
                }}
                title={options.title}
                value={valueString}
                rows={1}
                minRows={10}
                maxRows={40}
            />
        </WidgetField>
    );
});

export const SimpleJsonWidgetPlugin: WidgetPlugin = {
    id: 'simple-json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: SimpleJsonWidget
};
