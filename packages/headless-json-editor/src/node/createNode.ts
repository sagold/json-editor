import { uuid } from '../utils/uuid';

import { getTypeOf, JsonPointer, SchemaNode, ValidationPath } from 'json-schema-library';
import {
    Node,
    NodeType,
    ArrayNode,
    ObjectNode,
    FileNode,
    StringNode,
    NumberNode,
    BooleanNode,
    NullNode,
    JsonSchema
} from '../types';

function propertySortResult(aIndex: number, bIndex: number) {
    if (aIndex === bIndex) {
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
    /** flag data as required (visual only) */
    required?: boolean;
} & Options;

type CreateNode = (schemaNode: SchemaNode, data: any, pointer: JsonPointer, isArrayItem: boolean) => Node;

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
        required: schema.minLength != null && schema.minLength > 0,
        ...uiOptions
    };

    if (options.title == null && uiOptions.showTitle !== false && property !== '#') {
        // @todo json-schema-library createSchema should add title=property
        options.title = property;
    }

    return options;
}

function getValueNodeProps<T extends NodeType, V>(
    type: T,
    schemaNode: SchemaNode,
    pointer: string,
    value: V,
    isArrayItem = false
) {
    const { node: sN, error } = schemaNode.reduceNode(value);
    if (sN == null) {
        console.log(error);
        throw new Error(`Failed reducing schema of (${type}) at '${pointer}'`);
    }
    const { schema } = sN;
    const property = getPropertyName(pointer);
    return {
        id: uuid(),
        type,
        pointer,
        property,
        isArrayItem,
        options: getOptions(schema, property),
        oneOfIndex: sN.oneOfIndex,
        schema,
        schemaNode,
        value,
        errors: []
    };
}

const getPropertyName = (pointer: string) => pointer.split('/').pop() as string;
const isHidden = (properties: Record<string, any>, property: string) => properties[property]?.options?.hidden === true;

export function updateOptionalPropertyList(node: ObjectNode) {
    const schemaProperties = node.schema.properties ?? {};
    const propertiesInSchema = Object.keys(schemaProperties);
    const requiredProperties = node.schema.required ?? [];
    const propertiesInData = node.children.map((child) => child.property);

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
    /**
     * @param arraySchemaNode - unreduced SchemaNode of array
     */
    array: (arraySchemaNode, data: unknown[], pointer, isArrayItem): ArrayNode => {
        const path: ValidationPath = [];
        const { schema } = arraySchemaNode;
        const property = getPropertyName(pointer);
        const node: ArrayNode = {
            id: uuid(),
            type: 'array',
            pointer,
            property,
            isArrayItem,
            schema,
            schemaNode: arraySchemaNode,
            options: {
                ...getOptions(schema, property),
                required: schema.minItems != null && schema.minItems > 0
            },
            children: [],
            errors: []
        };

        data.forEach((next, key) => {
            // Create a new node for each child, storing the reduced schema as schema and the unreduced schema in sourceNode
            const { node: itemSN } = arraySchemaNode.getNodeChild(key, data, { pointer, path, createSchema: true });
            if (itemSN) {
                // note: parent node got reduced, not itemSchemaNode
                // note: maybe tracking sourceSchema is no longer necessary (jlib = 10)
                const itemNode = _createNode(itemSN, next, `${pointer}/${key}`, true);
                node.children.push(itemNode);
            }
        });

        return node;
    },
    /**
     * @param objectSN - unreduced SchemaNode of object
     */
    object: (objectSN, data: Record<string, unknown>, pointer, isArrayItem): ObjectNode => {
        const path: ValidationPath = [];
        const reduceResult = objectSN.reduceNode(data, { pointer });

        // @todo reduceSchema now returns an error if a oneOf statement cannot be resolved
        // per default the initial schema was returned, which we restore here...
        let resolvedObjectSN = reduceResult.node ?? objectSN;
        if (reduceResult.error || reduceResult.node == null) {
            if (reduceResult.error?.code === 'one-of-error') {
                // @opnionated: if a json-schema could not be resolved, fallback to the first schema available
                // @todo: inform user/dev about this behaviour
                resolvedObjectSN = objectSN.oneOf?.[0] ?? objectSN;
            } else if (reduceResult.error) {
                const validData = objectSN.getData(data);
                const secondSN = objectSN.reduceNode(validData);
                console.log(
                    'createNode FAILED reducing objectSN:',
                    reduceResult.error,
                    secondSN.node?.schema ?? secondSN.error
                );
            }
        }

        const resolvedData = resolvedObjectSN.getData(data);
        const property = getPropertyName(pointer);

        const node: ObjectNode = {
            id: uuid(),
            type: 'object',
            pointer,
            property,
            isArrayItem,
            schema: resolvedObjectSN.schema,
            oneOfIndex: resolvedObjectSN?.oneOfIndex,
            schemaNode: objectSN,
            optionalProperties: [],
            missingProperties: [],
            options: getOptions(resolvedObjectSN.schema, property),
            children: [],
            errors: []
        };

        // CREATE CHILD NODES
        const currentProperties = Object.keys(resolvedData ?? {});
        currentProperties.forEach((key) => {
            const childPointer = `${pointer}/${key}`;
            const { node: nextSN } = objectSN.getNodeChild(key, resolvedData, {
                createSchema: true,
                pointer: childPointer,
                path
            });
            if (nextSN) {
                // @note if !isSchemaNode the property in data is ignored, we cleanup later
                const propertyNode = _createNode(nextSN, resolvedData[key], childPointer);
                node.children.push(propertyNode);
            }
            // @todo what to do with error?
        });

        // track optional properties (duplicate of this is in remove)
        updateOptionalPropertyList(node);

        // simplified solution to maintain order as is given by json-schema
        // should probably use combination of additionalProperties, dependencies, etc
        const listOfProperties = resolvedObjectSN.schema.properties
            ? Object.keys(resolvedObjectSN.schema.properties)
            : [];
        node.children.sort((a, b) =>
            propertySortResult(listOfProperties.indexOf(a.property), listOfProperties.indexOf(b.property))
        );

        return node;
    },
    string: (schemaNode, value: string, pointer, isArrayItem): StringNode =>
        getValueNodeProps('string', schemaNode, pointer, value, isArrayItem),
    file: (schemaNode, value: File, pointer, isArrayItem): FileNode =>
        getValueNodeProps('file', schemaNode, pointer, value, isArrayItem),
    number: (schemaNode, value: number, pointer, isArrayItem): NumberNode =>
        getValueNodeProps('number', schemaNode, pointer, value, isArrayItem),
    boolean: (schemaNode, value: boolean, pointer, isArrayItem): BooleanNode =>
        getValueNodeProps('boolean', schemaNode, pointer, value, isArrayItem),
    null: (schemaNode, value: null, pointer, isArrayItem): NullNode =>
        getValueNodeProps('null', schemaNode, pointer, value, isArrayItem)
};

export function _createNode<T extends Node = Node>(
    schemaNode: SchemaNode,
    data: unknown,
    pointer: JsonPointer,
    isArrayItem = false
): T {
    const dataType = data == null ? 'null' : (getTypeOf(data ?? schemaNode.schema.const) as NodeType);

    // 03/12/24 we now resolve the type defined by the json-schema instead of the data-type
    // - this ensures the form is generated
    // - @attention this drops invalid data
    const schemaType = schemaNode.schema.type as keyof typeof NODES;
    let resolvedType: keyof typeof NODES = NODES[schemaType] ? schemaType : dataType;
    if (Array.isArray(schemaType)) {
        resolvedType = (schemaType.includes(dataType) ? dataType : schemaType[0]) as keyof typeof NODES;
    }
    if (NODES[resolvedType]) {
        if (data instanceof File) {
            return NODES.file(schemaNode, data, pointer, isArrayItem) as T;
        }
        const node = NODES[resolvedType](schemaNode, data, pointer, isArrayItem) as T;
        return node;
    }
    // e.g. null, undefined, etc
    throw new Error(`unsupported datatype '${dataType}' in create node`);
}

export function createNode<T extends Node = Node>(
    schemaNode: SchemaNode,
    data: unknown,
    pointer: JsonPointer = '#',
    isArrayItem = false
): T {
    return _createNode(schemaNode, data, pointer, isArrayItem);
}
