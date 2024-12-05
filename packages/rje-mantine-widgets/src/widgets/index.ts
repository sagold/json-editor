import { ArrayWidgetPlugin } from './ArrayWidget';
import { BooleanWidgetPlugin } from './BooleanWidget';
import { MultiSelectWidgetPlugin } from './MultiSelect';
import { NullWidgetPlugin } from './NullWidget';
import { NumberWidgetPlugin } from './NumberWidget';
import { ObjectWidgetPlugin } from './ObjectWidget';
import { OneOfSelectWidgetPlugin } from './OneOfSelectWidget';
import { SelectWidgetPlugin } from './SelectWidget';
import { StringWidgetPlugin } from './StringWidget';
import { WidgetPlugin } from '@sagold/react-json-editor';
import { TextWidgetPlugin } from './TextWidget';
import { SimpleJsonWidgetPlugin } from './SimpleJsonWidget';

export const widgets: WidgetPlugin[] = [
    {
        id: 'hidden-widget',
        use: (node) => node.options?.hidden,
        Widget: () => null
    },
    SimpleJsonWidgetPlugin,
    OneOfSelectWidgetPlugin,
    MultiSelectWidgetPlugin,
    ArrayWidgetPlugin,
    ObjectWidgetPlugin,
    SelectWidgetPlugin,
    TextWidgetPlugin,
    StringWidgetPlugin,
    NumberWidgetPlugin,
    BooleanWidgetPlugin,
    NullWidgetPlugin
];
