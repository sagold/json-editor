import { WidgetPlugin } from '@sagold/react-json-editor';
import { ArrayWidgetPlugin } from './arraywidget/ArrayWidget';
import { BooleanWidgetPlugin } from './booleanwidget/BooleanWidget';
import { FileWidgetPlugin } from './filewidget/FileWidget';
import { MasterDetailWidgetPlugin } from './masterdetailwidget/MasterDetailWidget';
import { MultiSelectWidgetPlugin } from './multiselectwidget/MultiSelectWidget';
import { NullWidgetPlugin } from './nullwidget/NullWidget';
import { NumberWidgetPlugin } from './numberwidget/NumberWidget';
import { ObjectWidgetPlugin } from './objectwidget/ObjectWidget';
import { SelectOneOfWidgetPlugin } from './selectoneofwidget/SelectOneOfWidget';
import { StringWidgetPlugin, SelectWidget } from './stringwidget/StringWidget';
import { TextWidgetPlugin } from './textwidget/TextWidget';
import { SimpleJsonWidgetPlugin } from './simplejsonwidget/SimpleJsonWidget';
import { UnknownWidgetPlugin } from './unknownwidget/UnknownWidget';

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
