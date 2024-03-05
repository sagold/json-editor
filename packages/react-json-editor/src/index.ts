import { JsonEditor, JsonEditorOptions, setDefaultWidgets } from './lib/JsonEditor';
import { JsonForm, JsonFormProps } from './lib/components/jsonform';
import { useJsonEditor, UseJsonEditorOptions } from './lib/useJsonEditor';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/decorators';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
import { WidgetDescription, WidgetDescriptionProps } from './lib/components/widget/WidgetDescription';
import { WidgetError, WidgetErrorProps } from './lib/components/widget/WidgetError';
import { WidgetField, WidgetFieldProps, WidgetFieldHeaderProps } from './lib/components/widget/WidgetField';
import { Label } from './lib/components/label/Label';
export {
    // components
    JsonForm,
    Label,
    Widget,
    WidgetDescription,
    WidgetError,
    WidgetField,
    // integration
    widget,
    // core
    JsonEditor,
    setDefaultWidgets,
    useJsonEditor
};
// types
export type {
    JsonFormProps,
    DecoratedWidget,
    DecoratedWidgetProps,
    JsonEditorOptions,
    UseJsonEditorOptions,
    WidgetDescriptionProps,
    WidgetErrorProps,
    WidgetFieldHeaderProps,
    WidgetFieldProps,
    WidgetPlugin,
    WidgetProps
};

// re-exports from headless-json-editor & json-schema-library
import {
    create,
    deepEqual,
    errors,
    EventLoggerPlugin,
    find,
    flat,
    get,
    getChildNode,
    getErrors,
    getOptions,
    HeadlessJsonEditor,
    HistoryPlugin,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    json,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    setErrorMessages,
    splitErrors,
    trace,
    unlinkAll,
    unlinkPath,
    updateErrors,
    updateOptions,
    updateSchema,
    // types
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
    HeadlessJsonEditorOptions,
    HistoryPluginInstance,
    JsonError,
    JsonSchema,
    Plugin,
    PluginInstance,
    PluginEvent,
    Node,
    NodeType,
    NullNode,
    NumberNode,
    ObjectNode,
    OnChangeListener,
    ParentNode,
    StringNode,
    ValueNode
} from 'headless-json-editor';

export {
    create,
    errors,
    deepEqual,
    EventLoggerPlugin,
    find,
    flat,
    get,
    getChildNode,
    getErrors,
    getOptions,
    HeadlessJsonEditor,
    HistoryPlugin,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    json,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    setErrorMessages,
    splitErrors,
    trace,
    unlinkAll,
    unlinkPath,
    updateErrors,
    updateOptions,
    updateSchema
};

export type {
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
    HeadlessJsonEditorOptions,
    HistoryPluginInstance,
    JsonError,
    JsonSchema,
    Node,
    NodeType,
    NullNode,
    NumberNode,
    ObjectNode,
    OnChangeListener,
    ParentNode,
    Plugin,
    PluginInstance,
    PluginEvent,
    StringNode,
    ValueNode
};
