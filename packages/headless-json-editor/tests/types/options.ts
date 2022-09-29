// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-schema/index.d.ts

type DefaultOptions = {
    title?: string;
    description?: string;
    disabled?: boolean;
    hidden?: boolean;
};

type Options = {
    object: DefaultOptions;
    array: DefaultOptions;
    number: DefaultOptions;
    string: DefaultOptions;
};

// export type JsonSchemaV7<A = DefaultOptions, O = DefaultOptions, N = NumberSchema, S = DefaultOptions> =
export type JsonSchemaV7<T extends Options> = ArraySchema<T> | ObjectSchema<T> | StringSchema<T> | NumberSchema<T>;

type NumberSchema<T extends Options> = {
    // commmon
    $comment?: string;
    description?: string;
    $id?: string;
    $ref?: string;
    format?: string;
    title?: string;

    // string
    type: 'number';
    exclusiveMaximum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    minimum?: number;
    multipleOf?: number;
    options?: T['number'];

    // convention
    [p: string]: any;
};

type StringSchema<T extends Options> = {
    // commmon
    $comment?: string;
    description?: string;
    $id?: string;
    $ref?: string;
    format?: string;
    title?: string;

    // string
    type: 'string';
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    options?: T['string'];

    // convention
    [p: string]: any;
};

type ArraySchema<T extends Options> = {
    // commmon
    $comment?: string;
    description?: string;
    $id?: string;
    $ref?: string;
    format?: string;
    title?: string;

    // array
    type: 'array';
    options?: T['array'];
    items?: JsonSchemaV7<T> | JsonSchemaV7<T>[];
    additionalItems?: JsonSchemaV7<T>;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: JsonSchemaV7<T>;

    // convention
    [p: string]: any;
};

type ObjectSchema<T extends Options> = {
    // commmon
    $comment?: string;
    description?: string;
    $id?: string;
    $ref?: string;
    format?: string;
    title?: string;

    // object
    type: 'object';
    $schema?: string;
    default?: Record<string, any>;
    maxProperties?: number;
    minProperties?: number;
    options?: T['object'];
    required?: string[];

    properties?: {
        [p: string]: JsonSchemaV7<T>;
    };
    patternProperties?: {
        [p: string]: JsonSchemaV7<T>;
    };
    additionalProperties?: {
        [p: string]: JsonSchemaV7<T>;
    };
    dependencies?: {
        [key: string]: JsonSchemaV7<T> | string[];
    };
    propertyNames?: JsonSchemaV7<T>;

    // convention
    [p: string]: any;
};

// const schema: JsonSchemaV7<Options> = {
//     type: 'object',
//     options: {
//         title: 'object title',
//         description: 'true',
//         hidden: true
//     },
//     properties: {
//         title: {
//             type: 'string',
//             options: {
//                 description: 'true'
//             }
//         },
//         image: {
//             type: 'object',
//             options: {
//                 description: true
//             }
//         }
//     }
// };

// const title = schema.properties.title;
