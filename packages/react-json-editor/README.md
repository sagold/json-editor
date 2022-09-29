# react-json-editor

> react implementation of headless-json-editor using semantic-ui


## usage

```tsx
import { JsonEditor } from "@sagold/react-json-editor";

function MyForm({ schema, data}) {
    return <JsonEditor schema={schema} data={data} onChange={() => {}} />
}
```
