import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Form, Label } from 'semantic-ui-react';
import { json as jsonLanguage } from '@codemirror/lang-json';
import { jsonSchemaLinter } from './jsonSchemaLinter';
import { linter, lintGutter } from '@codemirror/lint';
import { StringNode, ParentNode, json, DefaultNodeOptions, JSONSchema } from 'headless-json-editor';
import { widget, WidgetPlugin, classNames } from '@sagold/react-json-editor';
import { useState, useCallback } from 'react';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';

export const JsonWidget = (props) => {
    if (props.node.schema.type === 'string') {
        return <JsonStringWidget {...props} />;
    }
    return <JsonDataWidget {...props} />;
};

export type JsonWidgetOptions = {
    schema?: JSONSchema;
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

    return (
        <div
            className={classNames('ed-form ed-form--value ed-value ed-code', options.classNames)}
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
                    extensions={[jsonLanguage(), lintGutter(), linter(jsonSchemaLinter(editor, node.schema || {}))]}
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
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const JsonStringWidget = widget<StringNode<JsonWidgetOptions>>(({ node, options, editor, setValue }) => {
    const [ref] = useCodeMirrorOnBlur(setValue, node.pointer);
    const onChangeListener = {};
    if (options.liveUpdate) {
        onChangeListener['onChange'] = setValue;
    } else {
        onChangeListener['ref'] = ref;
    }

    return (
        <div
            className={classNames('ed-form ed-form--value ed-value ed-code', options.classNames)}
            data-type="object"
            data-id={node.pointer}
        >
            <Form.Field id={node.id} error={node.errors.length > 0} disabled={options.disabled}>
                <label>{options.title as string}</label>
                {/*https://uiwjs.github.io/react-codemirror/*/}
                <CodeMirror
                    value={node.value}
                    basicSetup={options.setup}
                    editable={options.disabled === false}
                    extensions={[jsonLanguage(), lintGutter(), linter(jsonSchemaLinter(editor, options.schema || {}))]}
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
            {options.description && <em className="ed-description">{options.description}</em>}
        </div>
    );
});

export const JsonWidgetPlugin: WidgetPlugin = {
    id: 'json-widget',
    use: ({ schema }, options) => options?.widget === 'json' || schema.format === 'json',
    Widget: JsonWidget
};
