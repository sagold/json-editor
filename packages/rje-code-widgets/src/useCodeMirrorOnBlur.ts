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
export function useCodeMirrorOnBlur(onBlur?: (value: string) => void) {
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
        const valueFromEvent = () => {
            if (onBlur == null) {
                return;
            }
            const contents = codeMirror?.view?.state.doc.toString();
            if (contents) {
                onBlur(contents);
            }
        };
        contentDOM.addEventListener('blur', valueFromEvent);
        return function () {
            contentDOM.removeEventListener('blur', valueFromEvent);
        };
    }, [codeMirror, onBlur]);
    return [ref];
}
