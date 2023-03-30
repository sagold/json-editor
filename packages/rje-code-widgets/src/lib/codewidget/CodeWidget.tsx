import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { useCodeMirrorOnBlur } from '../useCodeMirrorOnBlur';
import { widget, Widget, Label, WidgetPlugin, StringNode, DefaultNodeOptions } from '@sagold/react-json-editor';

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
                <Widget.Field widgetType="code" node={node} options={options}>
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
                    />
                </Widget.Field>
            );
        })
    };
}
