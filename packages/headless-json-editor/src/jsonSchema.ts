import { DefaultNodeOptions } from "./node/createNode";

/**
 * JSON Schema v7 taken from "json-schema" library
 */
export type O = Record<string, unknown>;

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JsonSchemaTypeName =
    | 'string' //
    | 'number'
    | 'integer'
    | 'boolean'
    | 'object'
    | 'array'
    | 'null';

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JsonSchemaType =
    | string //
    | number
    | boolean
    | JsonSchemaObject
    | JsonSchemaArray
    | null;

// Workaround for infinite type recursion
export interface JsonSchemaObject {
    [key: string]: JsonSchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface JsonSchemaArray extends Array<JsonSchemaType> {}


/**
 * JSON Schema v7 taken from "json-schema"
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01
 */
export type JsonSchemaDefinition = JsonSchema | boolean;
export interface JsonSchema {
    $id?: string | undefined;
    $ref?: string | undefined;
    /**
     * Meta schema
     *
     * Recommended values:
     * - 'http://json-schema.org/schema#'
     * - 'http://json-schema.org/hyper-schema#'
     * - 'http://json-schema.org/draft-07/schema#'
     * - 'http://json-schema.org/draft-07/hyper-schema#'
     *
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-5
     */
    $schema?: string | undefined;
    $comment?: string | undefined;

    /**
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-8.2.4
     * @see https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#appendix-A
     */
    $defs?: {
        [key: string]: JsonSchemaDefinition;
    } | undefined;

    /**
     * custom json-editor additions
     */
    options?: Partial<DefaultNodeOptions>;

    /**
    * custom json-schema-library additions
    */
    isActive?: boolean;
    isDynamic?: boolean;
    /**
     * use besides oneOf-statements to sepcifically identify oneOf-object by object-property
     * @see https://github.com/sagold/json-schema-library?tab=readme-ov-file#oneofproperty
     */
    oneOfProperty?: string;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
     */
    type?: JsonSchemaTypeName | JsonSchemaTypeName[] | undefined;
    enum?: JsonSchemaType[] | undefined;
    const?: JsonSchemaType | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
     */
    multipleOf?: number | undefined;
    maximum?: number | undefined;
    exclusiveMaximum?: number | undefined;
    minimum?: number | undefined;
    exclusiveMinimum?: number | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
     */
    maxLength?: number | undefined;
    minLength?: number | undefined;
    pattern?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
     */
    items?: JsonSchemaDefinition | JsonSchemaDefinition[] | undefined;
    additionalItems?: JsonSchemaDefinition | undefined;
    maxItems?: number | undefined;
    minItems?: number | undefined;
    uniqueItems?: boolean | undefined;
    contains?: JsonSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
     */
    maxProperties?: number | undefined;
    minProperties?: number | undefined;
    required?: string[] | undefined;
    properties?: {
        [key: string]: JsonSchemaDefinition;
    } | undefined;
    patternProperties?: {
        [key: string]: JsonSchemaDefinition;
    } | undefined;
    additionalProperties?: JsonSchemaDefinition | undefined;
    dependencies?: {
        [key: string]: JsonSchemaDefinition | string[];
    } | undefined;
    propertyNames?: JsonSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
     */
    if?: JsonSchemaDefinition | undefined;
    then?: JsonSchemaDefinition | undefined;
    else?: JsonSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
     */
    allOf?: JsonSchemaDefinition[] | undefined;
    anyOf?: JsonSchemaDefinition[] | undefined;
    oneOf?: JsonSchemaDefinition[] | undefined;
    not?: JsonSchemaDefinition | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
     */
    format?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
     */
    contentMediaType?: string | undefined;
    contentEncoding?: string | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
     */
    definitions?: {
        [key: string]: JsonSchemaDefinition;
    } | undefined;

    /**
     * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
     */
    title?: string | undefined;
    description?: string | undefined;
    default?: JsonSchemaType | undefined;
    readOnly?: boolean | undefined;
    writeOnly?: boolean | undefined;
    examples?: JsonSchemaType | undefined;

    /**
     * json-schema ignores unknown properties
     */
    [p: string]: any;
}
