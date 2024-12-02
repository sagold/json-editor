import { WidgetPlugin } from '@sagold/react-json-editor';
import { ObjectWidgetPlugin } from './objectwidget/ObjectWidget';
import { StringWidgetPlugin } from './stringwidget/StringWidget';

export const widgets: WidgetPlugin[] = [
    {
        id: 'hidden-widget',
        use: (node) => node.options?.hidden,
        Widget: () => null
    },
    StringWidgetPlugin,
    ObjectWidgetPlugin
];
