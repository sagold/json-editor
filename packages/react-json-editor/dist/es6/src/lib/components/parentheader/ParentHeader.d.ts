/// <reference types="react" />
import { SemanticCOLORS } from 'semantic-ui-react';
import { DefaultNodeOptions, Node } from 'headless-json-editor';
export declare type NodeOptions = {
    header?: {
        inverted?: boolean;
        color?: SemanticCOLORS;
    };
} & DefaultNodeOptions;
export declare type ParentHeaderProps = {
    node: Node;
    options: NodeOptions;
    icon?: React.ReactNode;
    children?: React.ReactNode | React.ReactNodeArray;
};
export declare function ParentHeader({ node, icon, options, children }: ParentHeaderProps): JSX.Element;
