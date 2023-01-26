import { JsonForm as Form, JsonFormProps } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../../index';

export function JsonForm(props: JsonFormProps) {
    const widgets = Array.isArray(props.widgets) ? props.widgets : defaultWidgets;
    return <Form {...props} />;
}
