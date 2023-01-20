import { v4 as uuid } from 'uuid';
import { getTypeOf, Draft, JSONPointer, isJSONError, isDynamicSchema, reduceSchema } from 'json-schema-library';
import {
    Node,
    NodeType,
    ArrayNode,
    ObjectNode,
    StringNode,
    NumberNode,
    BooleanNode,
    NullNode,
    JSONSchema
} from '../types';
// @ts-ignore
import deepmerge from 'deepmerge';
/**
 * returns a new json-schema, where properties are combined and arrays are replaced
 */
// const mergeUniqueItems = (destinationArray: unknown[], sourceArray: unknown[]) => {
//     const all = destinationArray.concat(sourceArray);
//     return all.filter((item, pos) => all.indexOf(item) === pos);
// };
// export const mergeArraysUnique = <T>(a: Partial<T>, b: Partial<T>): T =>
//     deepmerge(a, b, { arrayMerge: mergeUniqueItems });

const TEMPLATE_OPTIONS = {
    addOptionalProps: false
};

export type DefaultNodeOptions = {
    /** additional classnames the ui should add to the root of this data point */
    classNames?: string[];
    /** description of this data point */
    description?: string;
    /** if changes to this data point are disabled */
    disabled: boolean;
    /** if supported, will add a placeholder for the input element */
    placeholder?: string;
    /** if this data point should be hidden from display */
    hidden: boolean;
    /** title of this data point */
    title?: string;
    /** disable edit of form, but allow selection and copy of value */
    readOnly?: boolean;
    required?: boolean;
    [o: string]: unknown;
};

type CreateNode = (draft: Draft, data: any, schema: JSONSchema, pointer: JSONPointer, isArrayItem: boolean) => Node;

export function getOptions(schema: JSONSchema, property: string) {
    if (schema == null) {
        throw new Error('Missing schema in get options');
    }
    const uiOptions = schema.options ?? {};
    const options: DefaultNodeOptions = {
        title: schema.title || property,
        description: schema.description,
        disabled: false,
        hidden: false,
        ...uiOptions
    };
    if (uiOptions.showTitle === false) {
        delete options.title;
    }
    if (uiOptions.showDescription === false) {
        delete options.description;
    }
    return options;
}

function getPropertyName(pointer: string) {
    return pointer.split('/').pop() as string;
}

function isObject(v: unknown): v is Record<string, unknown> {
    return getTypeOf(v) === 'object';
}

function isHidden(properties: Record<string, any>, property: string) {
    return properties[property]?.options?.hidden === true;
}

export function updateOptionalPropertyList(node: ObjectNode, data: Record<string, unknown>) {
    const schemaProperties = node.schema.properties ?? {};

    const propertiesInSchema = Object.keys(schemaProperties);
    const requiredProperties = node.schema.required ?? [];
    const propertiesInData = Object.keys(data ?? {});

    // defined or set, but not required properties
    // - add all defined properties that are not required
    // - add all data properties that are missing and not required
    const optionalProperties = propertiesInSchema.filter(
        (prop) => !requiredProperties.includes(prop) && !isHidden(schemaProperties, prop)
    );

    propertiesInData.forEach((prop) => {
        if (
            !optionalProperties.includes(prop) &&
            !requiredProperties.includes(prop) &&
            !isHidden(schemaProperties, prop)
        ) {
            optionalProperties.push(prop);
        }
    });

    // optional properties that are not within data
    const missingProperties: string[] = [];
    optionalProperties.forEach((prop) => {
        if (!propertiesInData.includes(prop) && !isHidden(schemaProperties, prop)) {
            missingProperties.push(prop);
        }
    });

    node.missingProperties = missingProperties;
    node.optionalProperties = optionalProperties;
}

export const NODES: Record<NodeType, CreateNode> = {
    array: (core, data: unknown[], schema, pointer, isArrayItem): ArrayNode => {
        // console.log("create array", schema);
        const property = getPropertyName(pointer);
        const node: ArrayNode = {
            id: uuid(),
            type: 'array',
            pointer,
            property,
            isArrayItem,
            schema,
            options: {
                ...getOptions(schema, property),
                required: schema.minItems != null && schema.minItems > 0
            },
            children: [],
            errors: []
        };

        const variableSchema = getTypeOf(schema.items) === 'object' && isDynamicSchema(schema.items);
        // console.log("create array items from", schema);
        // @todo replace by jlib helpers
        data.forEach((next, key) => {
            const childSchema = core.step(key, schema, data, pointer);
            if (childSchema && !isJSONError(childSchema)) {
                childSchema.isArrayItem = true;
                node.children.push(create(core, next, childSchema, `${pointer}/${key}`, true));
            }
        });

        return node;
    },
    object: (draft, data: Record<string, unknown>, schema, pointer, isArrayItem): ObjectNode => {
        // if this is an object from a oneOf-list, the schema comes resolved
        // to this data. Resolve schema back to actual source
        const sourceSchema: JSONSchema =
            (schema.getOneOfOrigin && (schema.getOneOfOrigin().schema as JSONSchema)) || schema;
        // schema without any dynamic properties, those have been resolved by given data
        const staticSchema = reduceSchema(draft, sourceSchema, data);
        // staticSchema._oneOfOrigin = schema._oneOfOrigin;
        // final data complemented with missing data from resolved static schema
        const resolvedData = draft.getTemplate(data, staticSchema, TEMPLATE_OPTIONS);
        const property = getPropertyName(pointer);

        const node: ObjectNode = {
            id: uuid(),
            type: 'object',
            pointer,
            property,
            isArrayItem,
            schema: staticSchema,
            // @ts-ignore
            sourceSchema,
            optionalProperties: [],
            missingProperties: [],
            options: getOptions(staticSchema, property),
            children: [],
            errors: []
        };

        // create child nodes
        const currentProperties = Object.keys(resolvedData ?? {});
        currentProperties.forEach((key) => {
            const nextSchema = draft.step(key, staticSchema, resolvedData, pointer);
            if (nextSchema && !isJSONError(nextSchema)) {
                node.children.push(create(draft, resolvedData[key], nextSchema, `${pointer}/${key}`));
            }
        });

        const listOfProperties = Object.keys(staticSchema.properties ?? {});

        // track optional properties (duplicate of this is in remove)
        updateOptionalPropertyList(node, resolvedData);

        // simplified solution to maintain order as is given by json-schema
        // should probably use combination of additionalProperties, dependencies, etc
        node.children.sort((a, b) => listOfProperties.indexOf(a.property) - listOfProperties.indexOf(b.property));

        return node;
    },
    string: (core, value: string, schema, pointer, isArrayItem): StringNode => {
        const property = getPropertyName(pointer);
        const node: StringNode = {
            id: uuid(),
            type: 'string',
            pointer,
            property,
            isArrayItem,
            options: {
                ...getOptions(schema, property),
                required: schema.minLength != null && schema.minLength > 0
            },
            schema,
            value,
            errors: []
        };
        return node;
    },
    number: (core, value: number, schema, pointer, isArrayItem): NumberNode => {
        const property = getPropertyName(pointer);
        const node: NumberNode = {
            id: uuid(),
            type: 'number',
            pointer,
            property,
            isArrayItem,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    },
    boolean: (core, value: boolean, schema, pointer, isArrayItem): BooleanNode => {
        const property = getPropertyName(pointer);
        const node: BooleanNode = {
            id: uuid(),
            type: 'boolean',
            pointer,
            property,
            isArrayItem,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    },
    null: (core, value: null, schema, pointer, isArrayItem): NullNode => {
        const property = getPropertyName(pointer);
        const node: NullNode = {
            id: uuid(),
            type: 'null',
            pointer,
            property,
            isArrayItem,
            options: getOptions(schema, property),
            schema,
            value,
            errors: []
        };
        return node;
    }
};

export function create<T extends Node = Node>(
    draft: Draft,
    data: unknown,
    schema: JSONSchema = draft.rootSchema,
    pointer: JSONPointer = '#',
    isArrayItem = false
): T {
    const dataType = data == null ? 'null' : (getTypeOf(data ?? schema.const) as NodeType);

    if (NODES[dataType]) {
        const node = NODES[dataType](draft, data, schema, pointer, isArrayItem) as T;
        console.log('create', dataType, node);
        return node;
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}
