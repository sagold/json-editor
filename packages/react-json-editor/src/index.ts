import './lib/styles.scss';
import { JSONSchema } from 'headless-json-editor';

import { JsonForm, JsonFormProps } from './lib/components/jsonform';
import { useJsonEditor, UseJsonEditorOptions } from './lib/useJsonEditor';
import { JsonEditor, JsonEditorOptions } from './lib/JsonEditor';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/widgets/decorators';

export { JsonForm, Widget, widget, JsonEditor, useJsonEditor };

// widgets
export { defaultWidgets } from './lib/widgets/index';
export { ArrayWidget, ArrayWidgetPlugin } from './lib/widgets/arraywidget/ArrayWidget';
export { ObjectWidget, ObjectWidgetPlugin } from './lib/widgets/objectwidget/ObjectWidget';
export { NavigationWidget } from './lib/widgets/navigationwidget/NavigationWidget';
export { NumberWidget, NumberWidgetPlugin } from './lib/widgets/NumberWidget';
export { ErrorWidget, ErrorWidgetPlugin } from './lib/widgets/ErrorWidget';
export { MultiSelectWidget, MultiSelectWidgetPlugin } from './lib/widgets/MultiSelectWidget';
export { NullWidget, NullWidgetPlugin } from './lib/widgets/NullWidget';
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
