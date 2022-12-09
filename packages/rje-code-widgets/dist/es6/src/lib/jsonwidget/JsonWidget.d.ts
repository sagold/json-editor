/// <reference types="react" />
import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { StringNode, ParentNode, DefaultNodeOptions, JSONSchema } from 'headless-json-editor';
import { WidgetPlugin } from '@sagold/react-json-editor';
export declare const JsonWidget: (props: any) => JSX.Element;
export declare type JsonWidgetOptions = {
    schema?: JSONSchema;
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
    setup?: ReactCodeMirrorProps['basicSetup'];
} & Pick<ReactCodeMirrorProps, 'theme' | 'height' | 'minHeight' | 'maxHeight' | 'indentWithTab'> & DefaultNodeOptions;
export declare const JsonDataWidget: import("react").MemoExoticComponent<(props: import("packages/react-json-editor/src/lib/widgets/decorators").WidgetProps<ParentNode<JsonWidgetOptions>>) => JSX.Element | null>;
export declare const JsonStringWidget: import("react").MemoExoticComponent<(props: import("packages/react-json-editor/src/lib/widgets/decorators").WidgetProps<StringNode<JsonWidgetOptions>>) => JSX.Element | null>;
export declare const JsonWidgetPlugin: WidgetPlugin;
