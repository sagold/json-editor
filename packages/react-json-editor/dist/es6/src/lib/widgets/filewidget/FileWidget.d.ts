/// <reference types="react" />
import { StringNode, DefaultNodeOptions } from 'headless-json-editor';
import { WidgetPlugin } from '../decorators';
export declare type FileWidgetOptions = {
    /**
     * mime types to accept for this file selection
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
     */
    accept?: string;
    /**
     * if set will add a download option for this file. The given url needs to
     * contain a {{value}} placeholder which will be replaced by the actual input value
     */
    downloadUrlTemplate?: string;
    /**
     * if set will add an image preview for this file. The given url needs to
     * contain a {{value}} placeholder which will be replaced by the actual input value
     */
    imageUrlTemplate?: string;
} & DefaultNodeOptions;
/**
 * @todo note that files cannot be on root because the tree will be recreated
 * and then an object is created. this has to be support thouroughly. Until then,
 * single files using strings do work.
 */
export declare const FileWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<StringNode<FileWidgetOptions>>) => JSX.Element | null>;
export declare const FileWidgetPlugin: WidgetPlugin;
