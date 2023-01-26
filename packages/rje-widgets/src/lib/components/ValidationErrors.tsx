import { Segment, Message } from 'semantic-ui-react';
import { JsonError } from 'json-schema-library';

export function ValidationErrors({ errors }: { errors: JsonError[] }) {
    if (errors.length === 0) {
        return null;
    }

    return (
        <Segment basic>
            <Message.List>
                {errors.map((e) => (
                    <Message.Item key={e.message}>{e.message}</Message.Item>
                ))}
            </Message.List>
        </Segment>
    );
}
