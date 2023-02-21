// shortcut with widgets assigned
export { JsonForm } from './lib/components/JsonForm';
// main export
import { widgets } from './lib/widgets/index';
export { widgets };
export default widgets;
// widgets
export { ArrayWidget, ArrayWidgetPlugin } from './lib/widgets/arraywidget/ArrayWidget';
export { BooleanWidget, BooleanWidgetPlugin, booleanDefaultOptions } from './lib/widgets/booleanwidget/BooleanWidget';
export { FileWidget, FileWidgetPlugin } from './lib/widgets/filewidget/FileWidget';
export { MultiSelectWidget, MultiSelectWidgetPlugin } from './lib/widgets/multiselectwidget/MultiSelectWidget';
export { NavigationWidget } from './lib/widgets/navigationwidget/NavigationWidget';
export { NullWidget, NullWidgetPlugin } from './lib/widgets/nullwidget/NullWidget';
export { NumberWidget, NumberWidgetPlugin } from './lib/widgets/numberwidget/NumberWidget';
export { ObjectWidget, ObjectWidgetPlugin } from './lib/widgets/objectwidget/ObjectWidget';
export { SelectOneOfWidget, SelectOneOfWidgetPlugin } from './lib/widgets/selectoneofwidget/SelectOneOfWidget';
export { StringWidget, StringWidgetPlugin } from './lib/widgets/stringwidget/StringWidget';
export { SelectWidget, SelectWidgetPlugin } from './lib/widgets/selectwidget/SelectWidget';
export { SimpleJsonWidget, SimpleJsonWidgetPlugin } from './lib/widgets/simplejsonwidget/SimpleJsonWidget';
export { UnknownWidget, UnknownWidgetPlugin } from './lib/widgets/unknownwidget/UnknownWidget';
