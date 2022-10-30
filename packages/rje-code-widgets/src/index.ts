import './lib/rje-code-widgets.css';
import { CodeWidgetOptions, CreateCodeWidgetParams, createCodeWidgetPlugin } from './lib/codewidget/CodeWidget';
import {
    JsonWidget,
    JsonWidgetPlugin,
    JsonStringWidget,
    JsonDataWidget,
    JsonWidgetOptions
} from './lib/jsonwidget/JsonWidget';

export { JsonWidget, JsonWidgetPlugin, JsonStringWidget, JsonDataWidget, createCodeWidgetPlugin };
export type { JsonWidgetOptions, CodeWidgetOptions, CreateCodeWidgetParams };
