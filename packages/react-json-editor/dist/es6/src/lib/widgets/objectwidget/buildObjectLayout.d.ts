import { ObjectNode } from 'headless-json-editor';
import { SemanticWIDTHS } from 'semantic-ui-react';
export declare type ObjectLayoutCell = {
    prop: string;
    width?: SemanticWIDTHS;
};
export declare type ObjectLayout = {
    cells: ObjectLayoutCell[];
};
export declare function buildObjectLayout(node: ObjectNode, layout: ObjectLayout): ObjectLayoutCell[];
