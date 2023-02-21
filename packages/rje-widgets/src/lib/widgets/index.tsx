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
import { StringWidgetPlugin } from './stringwidget/StringWidget';
import { SelectWidgetPlugin } from './selectwidget/SelectWidget';
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
    SelectWidgetPlugin,
    FileWidgetPlugin,
    TextWidgetPlugin,
    StringWidgetPlugin,
    NumberWidgetPlugin,
    BooleanWidgetPlugin,
    NullWidgetPlugin,
    UnknownWidgetPlugin
];
