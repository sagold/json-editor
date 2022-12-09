import { memo, useCallback } from 'react';
/**
 * react memo node comparison
 */
const isEqual = (prev, next) => prev.node === next.node && prev.options === next.options;
/**
 * add setValue helper to editor component and reduce update cycles
 */
export function widget(WidgetComponent) {
    return memo((props) => {
        const setValue = useCallback((value) => props.editor.setValue(props.node.pointer, value), [props.node.id, props.node.pointer, props.editor]);
        return WidgetComponent({
            ...props,
            options: { ...props.node.options, ...props.editor.widgetOptions, ...props.options },
            setValue
        });
    }, isEqual);
}
//# sourceMappingURL=decorators.js.map