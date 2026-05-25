/**
 * My param type
 *
 * @template T  the generic data type to use
 */
export type UseHookOptions<T> = {
    /** any string */
    id: string;
    /** generic data */
    data: T;
};

/**
 * My function declaration
 *
 * @param options   hook options
 * @template Data   The type of data passed to options.
 * @returns returns an object with id = editor
 */
export function useHook<Data = unknown>(options: UseHookOptions<Data>) {
    return { type: 'editor', data: options.data };
}
