import Markdown from 'markdown-to-jsx';
import { useState, useCallback, useMemo } from 'react';
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { json as jsonSyntax, jsonLanguage } from '@codemirror/lang-json';
import {
    Widget,
    Label,
    JsonError,
    widget,
    WidgetPlugin,
    StringNode,
    ParentNode,
    getData,
    DefaultNodeOptions,
    JsonSchema,
    ObjectNode,
    WidgetProps
} from '@sagold/react-json-editor';
import { jsonSchemaCompletion } from './jsonSchemaCompletion';
import { jsonSchemaLinter } from './jsonSchemaLinter';
import { jsonSchemaTooltip } from './jsonSchemaTooltip';
import { linter, lintGutter } from '@codemirror/lint';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';

const InvalidJsonError: JsonError = {
    type: 'error',
    name: 'InvalidJsonError',
    code: 'invalid-json-error',
    message: 'Invalid json format. Changes will be applied only if the json is valid.',
    data: {
        pointer: '#',
        schema: {},
        value: {}
    }
} as const;

export const JsonWidget = (props: WidgetProps<ObjectNode | StringNode>) => {
    // @ts-expect-error types
    if (props.node.schema.type === 'string') {
        // @ts-expect-error types
        return <JsonStringWidget {...props} />;
    }
    // @ts-expect-error types
    return <JsonDataWidget {...props} />;
};

export type JsonWidgetOptions = {
    schema?: JsonSchema;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    // liveUpdate?: boolean;
    setup?: ReactCodeMirrorProps['basicSetup'];
} & Pick<ReactCodeMirrorProps, 'theme' | 'height' | 'minHeight' | 'maxHeight' | 'indentWithTab'> &
    DefaultNodeOptions;

export const JsonDataWidget = widget<ParentNode<JsonWidgetOptions>>(({ node, options, editor, setValue }) => {
    const [validJson, setJsonValid] = useState(true);
    const onChange = useCallback(
        (value: string) => {
            try {
                setValue(JSON.parse(value));
                setJsonValid(true);
            } catch (e) {
                // console.log('failed parsing (jsondata) value', value);
                setJsonValid(false);
            }
        },
        [setValue]
    );
    const [ref] = useCodeMirrorOnBlur(onChange, node.pointer);
    const onChangeListener = {};
    // @todo disabled live update - live update changes data (template values &
    // errors) causing the cursor to jump to position 0 while typing
    // if (options.liveUpdate) {
    //     onChangeListener['onChange'] = onChange;
    // } else {
    //     onChangeListener['ref'] = ref;
    // }
    onChangeListener['ref'] = ref;

    const extensions = [
        jsonSyntax(),
        // @todo readd completion using schemaNode
        jsonLanguage.data.of({
            autocomplete: jsonSchemaCompletion(node.schemaNode)
        }),
        lintGutter(),
        linter(jsonSchemaLinter(editor.schemaNode, node.schema)),
        jsonSchemaTooltip(editor, node.pointer)
    ];

    return (
        <Widget.Field
            widgetType="json"
            node={node}
            options={options}
            additionalError={validJson ? undefined : InvalidJsonError}
            showDescription={false}
        >
            <Label>{options.title as string}</Label>
            {/*https://uiwjs.github.io/react-codemirror/*/}
            <CodeMirror
                value={JSON.stringify(getData(node), null, 2)}
                basicSetup={options.setup}
                editable={options.disabled === false}
                extensions={extensions}
                height={options.height}
                minHeight={options.minHeight}
                maxHeight={options.maxHeight}
                indentWithTab={options.indentWithTab}
                placeholder={options.placeholder}
                readOnly={options.readOnly}
                theme={options.theme ?? 'light'}
                {...onChangeListener}
                style={{
                    border: '1px solid silver'
                }}
            />
            {options.description && (
                <Widget.Description>
                    <Markdown>{options.description}</Markdown>
                </Widget.Description>
            )}
        </Widget.Field>
    );
});

export const JsonStringWidget = widget<StringNode<JsonWidgetOptions>>(({ node, options, editor, setValue }) => {
    const [validJson, setJsonValid] = useState(true);
    const onChange = useCallback(
        (value: string) => {
            try {
                JSON.parse(value);
                setValue(value);
                setJsonValid(true);
            } catch (e) {
                // console.log('failed parsing (jsonstring) value', value);
                setJsonValid(false);
            }
        },
        [setValue]
    );

    // tooltip cannot be recreated, because of codemirror hooking into editor
    // instance in this case and there would be conflicting instances on the
    // editor state
    const tooltip = useMemo(() => jsonSchemaTooltip(editor, node.pointer, options.schema), []);
    const extensions = [jsonSyntax(), lintGutter(), linter(jsonSchemaLinter(editor.schemaNode, options.schema || {}))];

    if (options.schema) {
        const schemaNode = node.schemaNode.compileSchema(options.schema);
        extensions.push(
            tooltip,
            // @todo readd completion using schemaNode
            jsonLanguage.data.of({
                autocomplete: jsonSchemaCompletion(schemaNode)
            })
        );
    }

    const [ref] = useCodeMirrorOnBlur(onChange, node.pointer);
    const onChangeListener = {};
    if (options.liveUpdate) {
        onChangeListener['onChange'] = onChange;
    } else {
        onChangeListener['ref'] = ref;
    }

    return (
        <Widget.Field
            widgetType="json"
            node={node}
            options={options}
            additionalError={validJson ? undefined : InvalidJsonError}
            showDescription={false}
        >
            <Label>{options.title as string}</Label>
            {/*https://uiwjs.github.io/react-codemirror/*/}
            <CodeMirror
                value={node.value}
                basicSetup={options.setup}
                editable={options.disabled === false}
                extensions={extensions}
                height={options.height}
                minHeight={options.minHeight}
                maxHeight={options.maxHeight}
                indentWithTab={options.indentWithTab}
                placeholder={options.placeholder}
                readOnly={options.readOnly}
                theme={options.theme ?? 'light'}
                {...onChangeListener}
                style={{
                    border: '1px solid silver'
                }}
            />
            {options.description && (
                <Widget.Description>
                    <Markdown>{options.description}</Markdown>
                </Widget.Description>
            )}
        </Widget.Field>
    );
});

export const JsonWidgetPlugin: WidgetPlugin = {
    id: 'json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: JsonWidget
};
