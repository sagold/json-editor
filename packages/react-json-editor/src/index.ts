import { JsonEditor, JsonEditorOptions } from './lib/JsonEditor';
import { JsonForm, JsonFormProps } from './lib/components/jsonform';
import { useJsonEditor, UseJsonEditorOptions } from './lib/useJsonEditor';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/decorators';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
export { Widget, widget, JsonEditor, JsonForm, useJsonEditor };
// types
export type {
    JsonFormProps,
    JsonEditorOptions,
    UseJsonEditorOptions,
    WidgetProps,
    WidgetPlugin,
    DecoratedWidgetProps,
    DecoratedWidget
};

// re-exports from headless-json-editor & json-schema-library
import {
    create,
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
    JsonSchema,
    Plugin,
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

import { JsonError } from 'json-schema-library';

export {
    create,
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
    StringNode,
    ValueNode
};
