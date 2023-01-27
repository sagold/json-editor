import { Segment, Message } from 'semantic-ui-react';
import { JsonError } from '@sagold/react-json-editor';

export function ValidationErrors({ errors }: { errors: JsonError[] }) {
    if (errors.length === 0) {
        return null;
    }

    return (
        <Message error>
            <Message.List>
                {errors.map((e) => (
                    <Message.Item key={e.message}>{e.message}</Message.Item>
                ))}
            </Message.List>
        </Message>
    );
}
