import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { classNames } from '../classNames';
import { Form, Label } from 'semantic-ui-react';
import { json as jsonSyntax, jsonLanguage } from '@codemirror/lang-json';
import { jsonSchemaCompletion } from './jsonSchemaCompletion';
import { jsonSchemaLinter } from './jsonSchemaLinter';
import { jsonSchemaTooltip } from './jsonSchemaTooltip';
import { linter, lintGutter } from '@codemirror/lint';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';
import { useState, useCallback, useMemo } from 'react';
import {
    widget,
    WidgetPlugin,
    StringNode,
    ParentNode,
    json,
    DefaultNodeOptions,
    JsonSchema
} from '@sagold/react-json-editor';

export const JsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return <JsonStringWidget {...props} />;
    }
    return <JsonDataWidget {...props} />;
};

export type JsonWidgetOptions = {
    schema?: JsonSchema;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
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
                console.log('failed parsing value');
                setJsonValid(false);
            }
        },
        [setValue]
    );
    const [ref] = useCodeMirrorOnBlur(onChange, node.pointer);
    const onChangeListener = {};
    if (options.liveUpdate) {
        onChangeListener['onChange'] = onChange;
    } else {
        onChangeListener['ref'] = ref;
    }

    const extensions = [
        jsonSyntax(),
        jsonLanguage.data.of({
            autocomplete: jsonSchemaCompletion(editor.draft, node.schema)
        }),
        lintGutter(),
        linter(jsonSchemaLinter(editor, node.schema || {})),
        jsonSchemaTooltip(editor, node.pointer)
    ];

    return (
        <div
            className={classNames('rje-form rje-form--value rje-value rje-code', options.classNames)}
            data-type="object"
            data-id={node.pointer}
        >
            <Form.Field id={node.id} error={!validJson} disabled={options.disabled}>
                <label>{options.title as string}</label>
                {/*https://uiwjs.github.io/react-codemirror/*/}
                <CodeMirror
                    value={JSON.stringify(json(node), null, 2)}
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
            </Form.Field>
            {!validJson && (
                <Label color="red" basic prompt pointing="above">
                    Invalid json format. Changes will be applied only if the json is valid.
                </Label>
            )}
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
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
                console.log('failed parsing value');
                setJsonValid(false);
            }
        },
        [setValue]
    );

    // tooltip cannot be recreated, because of codemirror hooking into editor
    // instance in this case and there would be conflicting instances on the
    // editor state
    const tooltip = useMemo(() => jsonSchemaTooltip(editor, node.pointer, options.schema), []);
    const extensions = [jsonSyntax(), lintGutter(), linter(jsonSchemaLinter(editor, options.schema || {}))];
    if (options.schema) {
        extensions.push(
            tooltip,
            jsonLanguage.data.of({
                autocomplete: jsonSchemaCompletion(editor.draft, options.schema)
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
        <div
            className={classNames('rje-form rje-form--value rje-value rje-code', options.classNames)}
            data-type="object"
            data-id={node.pointer}
        >
            <Form.Field id={node.id} error={node.errors.length > 0 || !validJson} disabled={options.disabled}>
                <label>{options.title as string}</label>
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
            </Form.Field>
            {!validJson && (
                <Label color="red" basic prompt pointing="above">
                    Invalid json format. Changes will be applied only if the json is valid.
                </Label>
            )}
            {options.description && <em className="rje-description">{options.description}</em>}
        </div>
    );
});

export const JsonWidgetPlugin: WidgetPlugin = {
    id: 'json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: JsonWidget
};
