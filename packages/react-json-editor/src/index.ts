import './lib/styles.scss';
import { JSONSchema } from 'headless-json-editor';

import { JsonForm, useEditor, JsonFormProps } from './lib/components/jsonform';
import { useJsonEditor, UseJsonEditorOptions } from './lib/useJsonEditor';
import { JsonEditor, JsonEditorOptions } from './lib/JsonEditor';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/widgets/decorators';

export { JsonForm, Widget, widget, JsonEditor, useJsonEditor, useEditor };

// widgets
export { defaultWidgets } from './lib/widgets/index';
export { ArrayWidget, ArrayWidgetPlugin } from './lib/widgets/arraywidget/ArrayWidget';
export { ErrorWidget, ErrorWidgetPlugin } from './lib/widgets/ErrorWidget';
export { FileWidget, FileWidgetPlugin } from './lib/widgets/filewidget/FileWidget';
export { MultiSelectWidget, MultiSelectWidgetPlugin } from './lib/widgets/MultiSelectWidget';
export { NavigationWidget } from './lib/widgets/navigationwidget/NavigationWidget';
export { NullWidget, NullWidgetPlugin } from './lib/widgets/NullWidget';
export { NumberWidget, NumberWidgetPlugin } from './lib/widgets/NumberWidget';
export { ObjectWidget, ObjectWidgetPlugin } from './lib/widgets/objectwidget/ObjectWidget';
export { SelectOneOfWidget, SelectOneOfWidgetPlugin } from './lib/widgets/selectoneofwidget/SelectOneOfWidget';
export { StringWidget, StringWidgetPlugin } from './lib/widgets/StringWidget';
export { UnknownWidget, UnknownWidgetPlugin } from './lib/widgets/UnknownWidget';

// types
export type {
    JSONSchema,
    JsonFormProps,
    JsonEditorOptions,
    UseJsonEditorOptions,
    WidgetProps,
    WidgetPlugin,
    DecoratedWidgetProps,
    DecoratedWidget
};
