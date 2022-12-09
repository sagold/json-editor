import { jsx as _jsx } from "react/jsx-runtime";
import { Form } from 'semantic-ui-react';
import { RemoteEnumOptionsPlugin, get, isJSONError } from 'headless-json-editor';
import { useJsonEditor } from '../../useJsonEditor';
import { defaultWidgets } from '../../../index';
import { Widget } from '../widget/Widget';
import { forwardRef, useImperativeHandle } from 'react';
export const JsonForm = forwardRef(function JsonForm({ schema, data, pointer, widgets = defaultWidgets, plugins = [RemoteEnumOptionsPlugin], onChange, options, draft, cacheKey, validate, liveUpdate }, ref) {
    const [rootNode, instance] = useJsonEditor({
        schema,
        widgets,
        onChange,
        plugins,
        draftConfig: draft,
        data,
        cacheKey,
        validate,
        liveUpdate
    });
    useImperativeHandle(ref, () => instance);
    let node = rootNode;
    if (pointer) {
        const specificRootNode = get(rootNode, pointer);
        if (isJSONError(specificRootNode)) {
            console.error(`There is no node at '${pointer}', returning empty form`);
            return _jsx(Form, { error: true });
        }
        node = specificRootNode;
    }
    return (_jsx(Form, { error: true, children: _jsx(Widget, { node: node, editor: instance, options: options }) }));
});
//# sourceMappingURL=index.js.map