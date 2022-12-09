import { Plugin } from '../HeadlessJsonEditor';
import { Node } from '../types';
export declare type OnChangeListener<T = any> = (data: T, root: Node) => void;
/**
 * onChange((data) => do something)
 */
export declare const OnChangePlugin: Plugin;
