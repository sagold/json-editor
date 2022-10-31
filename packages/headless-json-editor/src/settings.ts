import { config } from 'json-schema-library';

export function setErrorMessages(errorMessages: Record<string, string> = defaultErrorMessages) {
    Object.assign(config.strings, errorMessages);
}

const defaultErrorMessages = {
    AdditionalItemsError: 'Array at `{{pointer}}` may not have an additional item `{{key}}`',
    AdditionalPropertiesError: 'Additional property `{{property}}` on `{{pointer}}` does not match schema `{{schema}}`',
    AllOfError: 'Value `{{value}}` at `{{pointer}}` does not match schema of `{{allOf}}`',
    AnyOfError: 'Value `{{value}}` at `{{pointer}}` does not match any schema of `{{anyOf}}`',
    ConstError: 'Expected value at `{{pointer}}` to be `{{expected}}`, but value given is `{{value}}`',
    containsAnyError: 'The array at `{{pointer}}` must contain at least one item',
    ContainsArrayError: 'The property at `{{pointer}}` must not be an array',
    ContainsError: 'The array at `{{pointer}}` must contain an element that matches `{{schema}}`',
    EnumError: 'Expected given value `{{value}}` in `{{pointer}}` to be one of `{{values}}`',
    FormatDateError: 'Value `{{value}}` at `{{pointer}}` is not a valid date',
    FormatDateTimeError: 'Value `{{value}}` at `{{pointer}}` is not a valid date-time',
    FormatEmailError: 'Value `{{value}}` at `{{pointer}}` is not a valid email',
    FormatHostnameError: 'Value `{{value}}` at `{{pointer}}` is not a valid hostname',
    FormatIPV4Error: 'Value `{{value}}` at `{{pointer}}` is not a valid IPv4 address',
    FormatIPV4LeadingZeroError: 'IPv4 addresses starting with zero are invalid, since they are interpreted as octals',
    FormatIPV6Error: 'Value `{{value}}` at `{{pointer}}` is not a valid IPv6 address',
    FormatIPV6LeadingZeroError: 'IPv6 addresses starting with zero are invalid, since they are interpreted as octals',
    FormatJSONPointerError: 'Value `{{value}}` at `{{pointer}}` is not a valid json-pointer',
    FormatRegExError: 'Value `{{value}}` at `{{pointer}}` is not a valid regular expression',
    FormatTimeError: 'Value `{{value}}` at `{{pointer}}` is not a valid time',
    FormatURIError: 'Value `{{value}}` at `{{pointer}}` is not a valid uri',
    FormatURIReferenceError: 'Value `{{value}}` at `{{pointer}}` is not a valid uri-reference',
    FormatURITemplateError: 'Value `{{value}}` at `{{pointer}}` is not a valid uri-template',
    FormatURLError: 'Value `{{value}}` at `{{pointer}}` is not a valid url',
    InvalidDataError: 'No value may be specified in `{{pointer}}`',
    InvalidPropertyNameError: 'Invalid property name `{{property}}` at `{{pointer}}`',
    MaximumError: 'Value in `{{pointer}}` is `{{length}}`, but should be `{{maximum}}` at maximum',
    MaxItemsError: 'Too many items in `{{pointer}}`, should be `{{maximum}}` at most, but got `{{length}}`',
    MaxLengthError: 'Value `{{pointer}}` should have a maximum length of `{{maxLength}}`, but got `{{length}}`.',
    MaxPropertiesError: 'Too many properties in `{{pointer}}`, should be `{{maximum}}` at most, but got `{{length}}`',
    MinimumError: 'Value in `{{pointer}}` is `{{length}}`, but should be `{{minimum}}` at minimum',
    MinItemsError: 'Too few items in `{{pointer}}`, should be at least `{{minimum}}`, but got `{{length}}`',
    MinItemsOneError: 'An item is required',
    MinLengthError: 'Value `{{pointer}}` should have a minimum length of `{{minLength}}`, but got `{{length}}`.',
    MinLengthOneError: 'Input is required',
    MinPropertiesError: 'Too few properties in `{{pointer}}`, should be at least `{{minimum}}`, but got `{{length}}`',
    MissingDependencyError: "The required propery '{{missingProperty}}' in `{{pointer}}` is missing",
    MissingOneOfPropertyError: 'Value at `{{pointer}}` property: `{{property}}`',
    MultipleOfError: 'Expected `{{value}}` in `{{pointer}}` to be multiple of `{{multipleOf}}`',
    MultipleOneOfError: 'Value `{{value}}` should not match multiple schemas in oneOf `{{matches}}`',
    NoAdditionalPropertiesError: 'Additional property `{{property}}` in `{{pointer}}` is not allowed',
    NotError: 'Value `{{value}}` at pointer should not match schema `{{not}}`',
    OneOfError: 'Value `{{value}}` in `{{pointer}}` does not match any given oneof schema',
    OneOfPropertyError:
        'Failed finding a matching oneOfProperty schema in `{{pointer}}` where `{{property}}` matches `{{value}}`',
    PatternError: 'Value in `{{pointer}}` should match `{{description}}`, but received `{{received}}`',
    PatternPropertiesError:
        'Property `{{key}}` does not match any patterns in `{{pointer}}`. Valid patterns are: {{patterns}}',
    RequiredPropertyError: 'The required property `{{key}}` is missing at `{{pointer}}`',
    TypeError: 'Expected `{{value}}` ({{received}}) in `{{pointer}}` to be of type `{{expected}}`',
    UndefinedValueError: 'Value must not be undefined in `{{pointer}}`',
    UniqueItemsError:
        'Expected unique items in {{pointer}}: duplicate value `{{value}}` found at {{itemPointer}} and {{duplicatePointer}}',
    UnknownPropertyError: 'Could not find a valid schema for property `{{pointer}}` within object',
    ValueNotEmptyError: 'A value for `{{property}}` is required at `{{pointer}}`'
};

setErrorMessages();
