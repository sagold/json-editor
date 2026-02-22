export { Editor } from '@sagold/react-json-editor';
export { JsonForm } from './components/JsonForm';
export { Icon } from './components/icon/Icon';
import { widgets } from './widgets';
export { widgets };
export default widgets;

export { ArrayWidget, ArrayWidgetPlugin } from './widgets/arraywidget/ArrayWidget';
export type { ArrayOptions } from './widgets/arraywidget/ArrayWidget';

export { getParentArrayPointer } from './features/dragndrop/getParentArrayPointer';
export { useDraggableItems, useDraggableTemplates } from './features/dragndrop/useDraggableItems';

export { SelectionProvider, SelectionContext, SelectionIcon } from './features/selection';
