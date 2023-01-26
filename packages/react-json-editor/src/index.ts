import { JsonSchema } from 'headless-json-editor';

import { JsonForm, JsonFormProps } from './lib/components/jsonform';
import { useJsonEditor, UseJsonEditorOptions } from './lib/useJsonEditor';
import { JsonEditor, JsonEditorOptions } from './lib/JsonEditor';
import { Widget, WidgetProps } from './lib/components/widget/Widget';
import { widget, WidgetPlugin, DecoratedWidgetProps, DecoratedWidget } from './lib/decorators';
import { classNames } from './lib/classNames';

export { Widget, widget, JsonEditor, JsonForm, useJsonEditor, classNames };

// types
export type {
    JsonSchema,
    JsonFormProps,
    JsonEditorOptions,
    UseJsonEditorOptions,
    WidgetProps,
    WidgetPlugin,
    DecoratedWidgetProps,
    DecoratedWidget
};
