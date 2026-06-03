/**
 * comment on parenttype
 *
 * @example
 * some ParentType example
 *
 * @template U  U is passed to data
 * @template L  L extends this TypeLiteral
 */
type ParentType<U, L> = L & {
    /** comment on data: U */
    data: U;
};

/** comment on LocalObjectType type */
type LocalObjectType = {
    /** @internal tag id as internal */
    id: string;
};

/** comment on LocalAddon type */
type LocalAddon = {
    /** comment to isLocalAddon */
    isLocalAddon: string;
};

/**
 * Main declaration we are interested in
 * @template UserData  Data passed in dynamically - unknown on compile time, but will be set for property: data.
 */
export type EditorOptions<UserData = unknown> = ParentType<UserData, { isLocalInline: boolean }> & {
    /** The list of available widgets to render the JSON Schema tree. Each node in the tree should have a matching widget to be rendered or the editor will either ignore or show an error using an Error Widget if added. */
    widgets?: LocalObjectType[];
} & LocalAddon;

/**
 * type to test combindation of inlined and ignored TypeReference
 */
type CombinedType = LocalAddon & LocalObjectType;
