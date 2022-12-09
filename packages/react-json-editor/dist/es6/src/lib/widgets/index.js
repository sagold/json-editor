import { ArrayWidgetPlugin } from './arraywidget/ArrayWidget';
import { BooleanWidgetPlugin } from './BooleanWidget';
import { ErrorWidgetPlugin } from './ErrorWidget';
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
export const defaultWidgets = [
    {
        id: 'hidden-widget',
        use: (node) => { var _a; return (_a = node.options) === null || _a === void 0 ? void 0 : _a.hidden; },
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
    ErrorWidgetPlugin,
    UnknownWidgetPlugin
];
//# sourceMappingURL=index.js.map