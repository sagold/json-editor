import { TreeCursor } from '@lezer/common';
import { Text } from '@codemirror/state';
import { Diagnostic } from '@codemirror/lint';
export declare function jsonLintPropertyDuplicates(doc: Text, cursor: TreeCursor, duplicates?: Diagnostic[]): Diagnostic[];
