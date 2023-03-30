import { WidgetPlugin, widget } from '@sagold/react-json-editor';
import { Label } from '../../components/label/Label';
import { WidgetField } from '../../components/widgetfield/WidgetField';
import { WidgetDescription } from '../../components/widgetdescription/WidgetDescription';

export const UnknownWidget = widget(({ node, options }) => (
    <WidgetField widgetType="string" node={node} options={options}>
        <div className="rje-field rje-field--unknown rje-field--error" data-type="unknown" data-id={node.pointer}>
            <Label>Unknown widget for node at '{node.pointer}'</Label>
            <WidgetDescription>{JSON.stringify({ ...node }, null, 2)}</WidgetDescription>
        </div>
    </WidgetField>
));

export const UnknownWidgetPlugin: WidgetPlugin = {
    id: 'unknown-widget',
    use: () => true,
    Widget: UnknownWidget
};
