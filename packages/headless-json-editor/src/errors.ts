import { createCustomError, JsonError, config } from 'json-schema-library';

export type { JsonError };

config.strings.InvalidPathError = `Path '{{pointer}}' does not exist in data`;
export const invalidPathError = createCustomError('InvalidPathError');

config.strings.InvalidNodeTypeError = `Invalid not type {{ type }} given`;
export const invalidNodeTypeError = createCustomError('InvalidNodeTypeError');
