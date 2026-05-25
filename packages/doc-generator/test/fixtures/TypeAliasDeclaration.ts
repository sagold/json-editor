type ParentType<U, L> = L & {
    data: U;
};

type LocalObjectType = {
    id: string;
};

type LocalAddon = {
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
