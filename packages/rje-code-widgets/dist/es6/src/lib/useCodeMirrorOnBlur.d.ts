/**
 * Register a function to CodeMirror onBlur event passing the current contents.
 *
 * usage
 *
 * ```ts
 * const [ref] = useCodeMirrorOnBlur((value: string) => setValue(value));
 * return <CodeMirror ref={ref} />;
 * ```
 */
export declare function useCodeMirrorOnBlur(onBlur?: (value: string) => void, pointer?: string): ((editor: any) => void)[];
