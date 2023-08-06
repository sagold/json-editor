import { JsonEditor, JsonForm as Form, JsonFormProps } from '@sagold/react-json-editor';
import { widgets as defaultWidgets } from '../../index';
import { forwardRef } from 'react';

export const JsonForm = forwardRef<JsonEditor, JsonFormProps>(function JsonForm(props, ref) {
    const widgets = Array.isArray(props.widgets) ? props.widgets : defaultWidgets;
    return <Form ref={ref} {...props} />;
});
