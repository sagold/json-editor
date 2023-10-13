import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useState, useEffect, useCallback } from 'react';

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
export function useCodeMirrorOnBlur(onBlur?: (value: string) => void, pointer?: string) {
    const [codeMirror, setCodeMirror] = useState<ReactCodeMirrorRef>();
    // required to reexecute this function as soon as the reference is passed
    const ref = useCallback((editor: ReactCodeMirrorRef) => {
        if (editor != null) {
            setCodeMirror(editor);
        }
    }, []);
    // register onBlur event to codeMirror editor
    useEffect(() => {
        const contentDOM = codeMirror?.view?.contentDOM;
        if (contentDOM == null || onBlur == null) {
            return;
        }
        const valueFromEvent = (event: FocusEvent) => {
            if (onBlur == null) {
                return;
            }
            const contents = codeMirror?.view?.state.doc.toString();
            contents && onBlur(contents);
        };
        contentDOM.addEventListener('blur', valueFromEvent);
        return function () {
            // console.log('remove on blur handler', pointer);
            contentDOM?.removeEventListener('blur', valueFromEvent);
        };
    }, [codeMirror, onBlur]);
    return [ref];
}
