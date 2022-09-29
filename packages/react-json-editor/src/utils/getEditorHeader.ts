import { Node } from '@sagold/headless-json-editor';
import { split } from 'gson-pointer';

export function getEditorHeader(node: Node) {
    const depth = split(node.pointer).length;
    return `h${Math.min(6, depth + 1)}` as keyof JSX.IntrinsicElements;
}
