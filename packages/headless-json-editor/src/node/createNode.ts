import { v4 as uuid } from 'uuid';
import { getTypeOf, Draft, JsonPointer, isJsonError, reduceSchema, isDynamicSchema, isSchemaNode, SchemaNode } from 'json-schema-library';
import { Node, NodeType, ArrayNode, ObjectNode, FileNode, StringNode, NumberNode, BooleanNode, NullNode, JsonSchema } from '../types';

function propertySortResult(aIndex: number, bIndex: number) {
    if (aIndex === -1 && bIndex === -1) {
        return 0;
    }
    if (aIndex === -1) {
        return 1;
    }
    if (bIndex === -1) {
        return -1;
    }
    return aIndex - bIndex;
}

export type DefaultNodeOptions<Options extends Record<string, unknown> = Record<string, unknown>> = {
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
} & Options;

type CreateNode = (schemaNode: SchemaNode, data: any, isArrayItem: boolean) => Node;

export function getOptions(schema: JsonSchema, property: string) {
    if (schema == null) {
        throw new Error('Missing schema in get options');
    }
    const uiOptions = schema.options ?? {};
    const options: DefaultNodeOptions = {
        title: uiOptions.showTitle == false ? undefined : schema.title,
        description: uiOptions.showDescription === false ? undefined : schema.description,
        disabled: false,
        hidden: false,
        ...uiOptions
    };

    if (options.title == null && uiOptions.showTitle !== false && property !== '#') {
        // @todo json-schema-library createSchema should add title=property
        options.title = property;
    }

    return options;
}

function getPropertyName(pointer: string) {
    return pointer.split('/').pop() as string;
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
    array: (arraySchemaNode, data: unknown[], isArrayItem): ArrayNode => {

        const { draft, schema, pointer } = arraySchemaNode;
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

        data.forEach((next, key) => {
            // here we move from a dynamic parent schema to a resolved/reduced child-schema
            // without dynamic schema-properties.
            const itemSchemaNode = draft.step(arraySchemaNode, key, data);

            if (isSchemaNode(itemSchemaNode)) {
                itemSchemaNode.schema.isArrayItem = true;
                const itemNode = _createNode(itemSchemaNode, next, true);
                // @todo find explicit retrieval of source schema

                // We need the/a source-schema to trigger change detectionin setValue (is schema dynamic?).
                // draft.step currently returns a resolved schema which prevents updates in certain nested
                // dynamic schemas.
                const unresolvedSchema = itemSchemaNode.path[itemSchemaNode.path.length - 1] ?? schema.items;
                if (unresolvedSchema && isDynamicSchema(unresolvedSchema)) {
                    // @ts-expect-error until we have a proper solution
                    itemNode.sourceSchema = unresolvedSchema;
                }

                // misses: additionalItems
                node.children.push(itemNode);
            }
        });

        return node;
    },
    object: (objectSchemaNode, data: Record<string, unknown>, isArrayItem): ObjectNode => {
        const { draft, schema, pointer } = objectSchemaNode;
        // if this is an object from a oneOf-list, the schema comes resolved
        // to this data. Resolve schema back to actual source
        let sourceSchema: JsonSchema = schema;
        if (schema.getOneOfOrigin) {
            // @todo we need this for all sorts of schemas. an annotated schema from
            // path would also solve this
            sourceSchema = schema.getOneOfOrigin().schema as JsonSchema;
        }

        // schema without any dynamic properties, those have been resolved by given data
        const reducedObjectSchemaNode = reduceSchema(objectSchemaNode, data);
        let staticSchema = reducedObjectSchemaNode.schema as JsonSchema;
        // @todo reduceSchema now returns an error if a oneOf statement cannot be resolved
        // per default the initial schema was returned, which we restore here...
        if (isJsonError(reducedObjectSchemaNode) && reducedObjectSchemaNode?.code === 'one-of-error') {
            staticSchema = sourceSchema;
        }

        // @todo getTemplate should not require type-setting in this case
        // final data complemented with missing data from resolved static schema
        const resolvedData = draft.getTemplate(data, { type: "object", ...staticSchema });
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
            // @attention @todo
            // this resolves the schema and omits the source-schema
            const nextSchemaNode = draft.step(draft.createNode(staticSchema, pointer), key, resolvedData);
            if (isSchemaNode(nextSchemaNode)) {
                // console.log("next node", nextSchemaNode.path);
                // @todo store sourceSchema on property node
                const propertyNode = _createNode(nextSchemaNode, resolvedData[key]);
                node.children.push(propertyNode);
            }
        });

        const listOfProperties = Object.keys(staticSchema.properties ?? {});

        // track optional properties (duplicate of this is in remove)
        updateOptionalPropertyList(node, resolvedData);

        // simplified solution to maintain order as is given by json-schema
        // should probably use combination of additionalProperties, dependencies, etc
        node.children.sort((a, b) =>
            propertySortResult(listOfProperties.indexOf(a.property), listOfProperties.indexOf(b.property))
        );

        return node;
    },
    string: (schemaNode, value: string, isArrayItem): StringNode => {
        const { schema, pointer } = schemaNode;
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
    file: (schemaNode, value: File, isArrayItem): FileNode => {
        const { schema, pointer } = schemaNode;
        const property = getPropertyName(pointer);
        const node: FileNode = {
            id: uuid(),
            type: 'file',
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
    number: (schemaNode, value: number, isArrayItem): NumberNode => {
        const { schema, pointer } = schemaNode;
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
    boolean: (schemaNode, value: boolean, isArrayItem): BooleanNode => {
        const { schema, pointer } = schemaNode;
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
    null: (schemaNode, value: null, isArrayItem): NullNode => {
        const { schema, pointer } = schemaNode;
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

function _createNode<T extends Node = Node>(
    schemaNode: SchemaNode,
    data: unknown,
    isArrayItem = false
): T {
    const dataType = data == null ? 'null' : (getTypeOf(data ?? schemaNode.schema.const) as NodeType);

    if (NODES[dataType]) {
        if (data instanceof File) {
            return NODES.file(schemaNode, data, isArrayItem) as T;
        }
        const node = NODES[dataType](schemaNode, data, isArrayItem) as T;
        return node;
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}

export function createNode<T extends Node = Node>(
    draft: Draft,
    data: unknown,
    schema: JsonSchema = draft.rootSchema,
    pointer: JsonPointer = '#',
    isArrayItem = false
): T {
    return _createNode(draft.createNode(schema, pointer), data, isArrayItem);
}
