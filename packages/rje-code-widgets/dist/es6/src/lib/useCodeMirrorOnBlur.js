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
export function useCodeMirrorOnBlur(onBlur, pointer) {
    const [codeMirror, setCodeMirror] = useState();
    // required to reexecute this function as soon as the reference is passed
    const ref = useCallback((editor) => {
        if (editor != null) {
            setCodeMirror(editor);
        }
    }, []);
    // register onBlur event to codeMirror editor
    useEffect(() => {
        var _a;
        const contentDOM = (_a = codeMirror === null || codeMirror === void 0 ? void 0 : codeMirror.view) === null || _a === void 0 ? void 0 : _a.contentDOM;
        if (contentDOM == null || onBlur == null) {
            return;
        }
        // console.log('register on blur handler', pointer);
        const valueFromEvent = (event) => {
            const dom = event.target;
            // console.log('call blur setValue', dom.innerText);
            dom.innerText && onBlur && onBlur(dom.innerText);
        };
        contentDOM.addEventListener('blur', valueFromEvent);
        return function () {
            // console.log('remove on blur handler', pointer);
            contentDOM === null || contentDOM === void 0 ? void 0 : contentDOM.removeEventListener('blur', valueFromEvent);
        };
    }, [codeMirror, onBlur]);
    return [ref];
}
//# sourceMappingURL=useCodeMirrorOnBlur.js.map