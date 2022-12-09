import { Node } from '../types';
/**
 * Returns a clone of the node. Each node is a shallow clone so do not modify
 * arrays or objetcs directly, expect for children
 *
 * @returns deep clone of node
 */
export declare function unlinkAll(node: Node): {
    id: string;
    type: "array";
    children: Node[];
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    errors: import("json-schema-library").JSONError[];
} | {
    id: string;
    type: "object";
    children: Node[];
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    errors: import("json-schema-library").JSONError[];
} | {
    id: string;
    type: "string";
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    value?: string | undefined;
    errors: import("json-schema-library").JSONError[];
} | {
    id: string;
    type: "number";
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    value?: number | undefined;
    errors: import("json-schema-library").JSONError[];
} | {
    id: string;
    type: "boolean";
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    value?: boolean | undefined;
    errors: import("json-schema-library").JSONError[];
} | {
    id: string;
    type: "null";
    options: import("..").DefaultNodeOptions;
    pointer: string;
    property: string;
    schema: import("json-schema").JSONSchema7 & {
        isActive?: boolean | undefined;
        isDynamic?: boolean | undefined;
        oneOfSchema?: (import("json-schema").JSONSchema7 & any) | undefined;
        options?: import("../types").JSONSchemaOptions | undefined;
        properties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        patternProperties?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        additionalProperties?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        dependencies?: {
            [key: string]: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | string[];
        } | undefined;
        definitions?: {
            [key: string]: import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions;
        } | undefined;
        allOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        anyOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        oneOf?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        not?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
        items?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions)[] | undefined;
        additionalItems?: (import("json-schema").JSONSchema7Definition & import("../types").JSONSchemaOptions) | undefined;
    };
    value?: null | undefined;
    errors: import("json-schema-library").JSONError[];
};
