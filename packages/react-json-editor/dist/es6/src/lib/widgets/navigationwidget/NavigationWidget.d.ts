/// <reference types="react" />
import { ParentNode, DefaultNodeOptions } from 'headless-json-editor';
export declare type NavigationWidgetOptions = {
    showProperties?: boolean;
} & DefaultNodeOptions;
/**
 * Navigation Editor
 *
 * Overview of current properties and array items. Mainly used as standalone
 * editor to show a navigation of the current form in a sidebar panel.
 *
 * Usage:
 *
 * ```jsx
 * <NavigationEditor
 *      node={node}
 *      editor={editor}
 *      // options={{ withChildren: true }}
 *  />
 * ```
 */
export declare const NavigationWidget: import("react").MemoExoticComponent<(props: import("../decorators").WidgetProps<ParentNode<NavigationWidgetOptions>>) => JSX.Element | null>;
