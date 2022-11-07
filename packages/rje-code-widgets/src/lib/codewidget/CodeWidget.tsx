import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { Form } from 'semantic-ui-react';
import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { widget, WidgetPlugin, classNames } from '@sagold/react-json-editor';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';

export type CodeWidgetOptions = {
    setup?: ReactCodeMirrorProps['basicSetup'];
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & Pick<ReactCodeMirrorProps, 'theme' | 'height' | 'minHeight' | 'maxHeight' | 'indentWithTab'> &
    DefaultNodeOptions;

export type CreateCodeWidgetParams = {
    extensions: ReactCodeMirrorProps['extensions'];
    /** format the widget should register to */
    format: string;
};

export function createCodeWidgetPlugin({ extensions, format }: CreateCodeWidgetParams): WidgetPlugin {
    if (typeof format !== 'string') {
        throw new Error(`Format is required to create a code widget. Given: '${format}'`);
    }
    return {
        id: `${format}-code-widget`,
        use: (node) => node.schema.type === 'string' && node.schema.format === format,
        Widget: widget<StringNode<CodeWidgetOptions>>(({ node, options, editor, setValue }) => {
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
                            extensions={extensions}
                            height={options.height}
                            minHeight={options.minHeight}
                            maxHeight={options.maxHeight}
                            indentWithTab={options.indentWithTab}
                            placeholder={options.placeholder}
                            readOnly={options.readOnly}
                            theme={options.theme ?? 'light'}
                            {...onChangeListener}
                        />
                    </Form.Field>
                    {options.description && <em className="ed-description">{options.description}</em>}
                </div>
            );
        })
    };
}
