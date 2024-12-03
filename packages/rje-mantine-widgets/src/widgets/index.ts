import { ArrayWidgetPlugin } from './ArrayWidget';
import { BooleanWidgetPlugin } from './BooleanWidget';
import { MultiSelectWidgetPlugin } from './MultiSelect';
import { NullWidgetPlugin } from './NullWidget';
import { NumberWidgetPlugin } from './NumberWidget';
import { ObjectWidgetPlugin } from './ObjectWidget';
import { SelectWidgetPlugin } from './SelectWidget';
import { StringWidgetPlugin } from './StringWidget';
import { WidgetPlugin } from '@sagold/react-json-editor';

export const widgets: WidgetPlugin[] = [
    {
        id: 'hidden-widget',
        use: (node) => node.options?.hidden,
        Widget: () => null
    },
    MultiSelectWidgetPlugin,
    ArrayWidgetPlugin,
    ObjectWidgetPlugin,
    SelectWidgetPlugin,
    BooleanWidgetPlugin,
    NumberWidgetPlugin,
    StringWidgetPlugin,
    NullWidgetPlugin
];
