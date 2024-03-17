import { Editor, EditorOptions, setDefaultWidgets } from './lib/Editor';
import { useEditorPlugin } from './lib/useEditorPlugin';
import { useEditor, UseEditorOptions } from './lib/useEditor';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/decorators';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
import { WidgetDescription, WidgetDescriptionProps } from './lib/components/widget/WidgetDescription';
import { WidgetError, WidgetErrorProps } from './lib/components/widget/WidgetError';
import { WidgetField, WidgetFieldProps, WidgetFieldHeaderProps } from './lib/components/widget/WidgetField';
import { Label } from './lib/components/label/Label';
export {
    // components
    Label,
    Widget,
    WidgetDescription,
    WidgetError,
    WidgetField,
    // integration
    widget,
    // core
    Editor,
    setDefaultWidgets,
    useEditor,
    useEditorPlugin
};
// types
export type {
    DecoratedWidget,
    DecoratedWidgetProps,
    EditorOptions,
    UseEditorOptions,
    WidgetDescriptionProps,
    WidgetErrorProps,
    WidgetFieldHeaderProps,
    WidgetFieldProps,
    WidgetPlugin,
    WidgetProps
};

// re-exports from headless-json-editor & json-schema-library
import {
    createNode,
    deepEqual,
    errors,
    EventLoggerPlugin,
    find,
    getNodeList,
    getNode,
    getChildNode,
    getErrors,
    getOptions,
    HistoryPlugin,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    getData,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    SetOptionTitleToPlugin,
    setErrorMessages,
    splitErrors,
    trace,
    unlinkAll,
    unlinkPath,
    update,
    updateErrors,
    updateOptions,
    updateSchema,
    // types
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
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
    createNode,
    errors,
    deepEqual,
    EventLoggerPlugin,
    find,
    getNodeList,
    getNode,
    getChildNode,
    getErrors,
    getOptions,
    HistoryPlugin,
    isJsonError,
    isNode,
    isParentNode,
    isValueNode,
    getData,
    move,
    OnChangePlugin,
    RemoteEnumOptionsPlugin,
    remove,
    set,
    SetOptionTitleToPlugin,
    setErrorMessages,
    splitErrors,
    trace,
    unlinkAll,
    unlinkPath,
    update,
    updateErrors,
    updateOptions,
    updateSchema
};

export type {
    ArrayNode,
    BooleanNode,
    Change,
    DefaultNodeOptions,
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
