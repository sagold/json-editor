export { Editor } from '@sagold/react-json-editor';

// widgets
import { widgets } from './widgets';
export { widgets };
export default widgets;

export { ArrayWidget, ArrayWidgetPlugin } from './widgets/arraywidget/ArrayWidget';
export type { ArrayOptions } from './widgets/arraywidget/ArrayWidget';
export { ObjectWidget, ObjectWidgetPlugin } from './widgets/objectwidget/ObjectWidget';
export type { ObjectOptions } from './widgets/objectwidget/ObjectWidget';

// features
export { getParentArrayPointer } from './features/dragndrop/getParentArrayPointer';
export { useDraggableItems, useDraggableTemplates } from './features/dragndrop/useDraggableItems';
export { SelectionProvider, SelectionContext, SelectionIcon, useSelect } from './features/selection';

// components
export { Icon } from './components/icon/Icon';
export { JsonForm } from './components/JsonForm';
export { WidgetField, Widget } from '@sagold/react-json-editor';
export { WidgetParentHeader } from './components/widgetheader/WidgetHeader';
export { WidgetDescription } from './components/WidgetDescription';
export { WidgetMenu } from './components/widgetmenu/WidgetMenu';

// tools
export { widgetInputProps } from './components/widgetInputProps';
export { useLiveUpdate } from './widgets/useLiveUpdate';

// third party
export { default as Sortable } from 'sortablejs';
export { default as classNames } from 'classnames';
