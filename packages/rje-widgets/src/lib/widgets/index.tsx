import { ArrayWidgetPlugin } from './arraywidget/ArrayWidget';
import { BooleanWidgetPlugin } from './BooleanWidget';
import { FileWidgetPlugin } from './filewidget/FileWidget';
import { MasterDetailWidgetPlugin } from './masterdetailwidget/MasterDetailWidget';
import { MultiSelectWidgetPlugin } from './MultiSelectWidget';
import { NullWidgetPlugin } from './NullWidget';
import { NumberWidgetPlugin } from './NumberWidget';
import { ObjectWidgetPlugin } from './objectwidget/ObjectWidget';
import { SelectOneOfWidgetPlugin } from './selectoneofwidget/SelectOneOfWidget';
import { StringWidgetPlugin, SelectWidget } from './StringWidget';
import { TextWidgetPlugin } from './TextWidget';
import { SimpleJsonWidgetPlugin } from './SimpleJsonWidget';
import { UnknownWidgetPlugin } from './UnknownWidget';
import { WidgetPlugin } from '@sagold/react-json-editor';

export const widgets: WidgetPlugin[] = [
    {
        id: 'hidden-widget',
        use: (node) => node.options?.hidden,
        Widget: () => null
    },
    SimpleJsonWidgetPlugin,
    MasterDetailWidgetPlugin,
    SelectOneOfWidgetPlugin,
    MultiSelectWidgetPlugin,
    ArrayWidgetPlugin,
    ObjectWidgetPlugin,
    {
        id: 'select-string-widget',
        use: (node) => node.schema.type === 'string' && Array.isArray(node.schema.enum),
        Widget: SelectWidget
    },
    FileWidgetPlugin,
    TextWidgetPlugin,
    StringWidgetPlugin,
    NumberWidgetPlugin,
    BooleanWidgetPlugin,
    NullWidgetPlugin,
    UnknownWidgetPlugin
];
