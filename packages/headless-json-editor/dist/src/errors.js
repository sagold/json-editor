import { createCustomError, config } from 'json-schema-library';
config.strings.InvalidPathError = `Path '{{pointer}}' does not exist in data`;
export const invalidPathError = createCustomError('InvalidPathError');
config.strings.InvalidNodeTypeError = `Invalid not type {{ type }} given`;
export const invalidNodeTypeError = createCustomError('InvalidNodeTypeError');
//# sourceMappingURL=errors.js.map