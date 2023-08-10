import { JsonForm as Form, JsonFormProps } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../../index';

export function JsonForm<Data = unknown>(props: JsonFormProps<Data>) {
    const widgets = Array.isArray(props.widgets) ? props.widgets : defaultWidgets;
    return <Form<Data> widgets={widgets} {...props} />;
}
