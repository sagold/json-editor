<p align="center">
    <img src="./docs/he-full-2000x564.png" width="100%" alt="_react-json-editor"><br />
    <img src="./docs/title-react-700x76.png" width="350px" alt="_react-json-editor">
</p>

<p align="center">
    <a href="https://sagold.github.io/json-editor/">Demo</a>
</p>

> react implementation of [headless-json-editor](../headless-json-editor) using [semantic-ui](https://semantic-ui.com/)

install

`yarn add @sagold/react-json-editor`

usage using `JsonEditor` component

```tsx
import { JsonForm } from '@sagold/react-json-editor';

function MyForm({ schema, data }) {
    return (
        <JsonForm
            schema={schema}
            data={data}
            onChange={(data) => {
                console.log('data', data);
            }}
        />
    );
}
```

usage using `useJsonEditor` hook

```tsx
import { Form } from 'semantic-ui-react';
import { useJsonEditor } from '@sagold/react-json-editor';

function MyForm() {
    const [node, jsonEditor] = useJsonEditor({
        schema,
        data,
        onChange: (data) => {
            console.log('data', data);
        }
    });

    if (node == null) {
        return <Form error />;
    }

    const Editor = jsonEditor.getEditor(node);

    return (
        <Form error>
            <Editor node={node} instance={jsonEditor} />
        </Form>
    );
}
```
