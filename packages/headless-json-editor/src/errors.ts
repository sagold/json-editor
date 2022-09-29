import { createCustomError, JSONError, config } from 'json-schema-library';

export type { JSONError };

// @todo improve error extension in jlib
// @ts-ignore
config.strings.InvalidPathError = `Path '{{pointer}}' does not exist in data`;
export const invalidPathError = createCustomError('InvalidPathError');

// @ts-ignore
config.strings.InvalidNodeTypeError = `Invalid not type {{ type }} given`;
export const invalidNodeTypeError = createCustomError('InvalidNodeTypeError');
