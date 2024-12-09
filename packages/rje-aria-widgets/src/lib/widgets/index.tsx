import { WidgetPlugin } from '@sagold/react-json-editor';
import { ArrayWidgetPlugin } from './arraywidget/ArrayWidget';
import { BooleanWidgetPlugin } from './booleanwidget/BooleanWidget';
import { ColorWidgetPlugin } from './colorwidget/ColorWidget';
import { DateWidgetPlugin } from './datewidget/DateWidget';
import { FileWidgetPlugin } from './filewidget/FileWidget';
import { MasterDetailWidgetPlugin } from './masterdetailwidget/MasterDetailWidget';
import { NullWidgetPlugin } from './nullwidget/NullWidget';
import { NumberWidgetPlugin } from './numberwidget/NumberWidget';
import { ObjectWidgetPlugin } from './objectwidget/ObjectWidget';
import { SelectOneOfWidgetPlugin } from './selectoneofwidget/SelectOneOfWidget';
import { StringWidgetPlugin } from './stringwidget/StringWidget';
import { SelectMultipleWidgetPlugin } from './selectmultiplewidget/SelectMultipleWidget';
import { SelectWidgetPlugin } from './selectwidget/SelectWidget';
import { TagListWidgetPlugin } from './taglistwidget/TagListWidget';
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
    SelectOneOfWidgetPlugin,
    ColorWidgetPlugin,
    DateWidgetPlugin,
    MasterDetailWidgetPlugin,
    TagListWidgetPlugin,
    SelectMultipleWidgetPlugin,
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
