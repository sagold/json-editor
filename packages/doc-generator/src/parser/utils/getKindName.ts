import ts, { SyntaxKind } from 'typescript';

export type KindName = keyof typeof SyntaxKind;

export const getKindName = (node: ts.Node): KindName => SyntaxKind[node.kind] as KindName;
