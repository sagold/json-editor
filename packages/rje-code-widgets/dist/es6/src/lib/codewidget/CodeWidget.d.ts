import { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import { DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from '@sagold/react-json-editor';
export declare type CodeWidgetOptions = {
    setup?: ReactCodeMirrorProps['basicSetup'];
    /** if value should update on each keystroke instead of on blur. Defaults to false */
    liveUpdate?: boolean;
} & Pick<ReactCodeMirrorProps, 'theme' | 'height' | 'minHeight' | 'maxHeight' | 'indentWithTab'> & DefaultNodeOptions;
export declare type CreateCodeWidgetParams = {
    extensions: ReactCodeMirrorProps['extensions'];
    /** format the widget should register to */
    format: string;
};
export declare function createCodeWidgetPlugin({ extensions, format }: CreateCodeWidgetParams): WidgetPlugin;
