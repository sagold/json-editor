import { ArrayWidgetPlugin } from './arraywidget/ArrayWidget';
import { BooleanWidgetPlugin } from './BooleanWidget';
import { MultiSelectWidgetPlugin } from './MultiSelect';
import { NullWidgetPlugin } from './nullwidget/NullWidget';
import { NumberWidgetPlugin } from './NumberWidget';
import { ObjectWidgetPlugin } from './objectwidget/ObjectWidget';
import { OneOfSelectWidgetPlugin } from './OneOfSelectWidget';
import { SelectWidgetPlugin } from './SelectWidget';
import { StringWidgetPlugin } from './StringWidget';
import { WidgetPlugin } from '@sagold/react-json-editor';
import { TextWidgetPlugin } from './TextWidget';
import { SimpleJsonWidgetPlugin } from './SimpleJsonWidget';
import { TagListWidgetPlugin } from './TagListWidget';
import { UnknownWidgetPlugin } from './UnknownWidget';
import { ColorWidgetPlugin } from './ColorWidget';

export const widgets: WidgetPlugin[] = [
    {
        id: 'hidden-widget',
        use: (node) => node.options?.hidden,
        Widget: () => null
    },
    SimpleJsonWidgetPlugin,
    OneOfSelectWidgetPlugin,
    MultiSelectWidgetPlugin,
    TagListWidgetPlugin,
    ArrayWidgetPlugin,
    ObjectWidgetPlugin,
    SelectWidgetPlugin,
    ColorWidgetPlugin,
    TextWidgetPlugin,
    StringWidgetPlugin,
    NumberWidgetPlugin,
    BooleanWidgetPlugin,
    NullWidgetPlugin,
    UnknownWidgetPlugin
];
