<p align="center">
  <img src="./docs/he-full-2000x564.png" width="100%" alt="rje-widgets"><br />
  <img src="./docs/title-react-700x76.png" width="350px" alt="rje-widgets">
</p>

> Simple and extensible React component capable of using JSON Schema to declaratively build and customize user forms.

install 

`yarn add @sagold/rje-widgets`

[![Npm package version](https://badgen.net/npm/v/@sagold/rje-widgets)](https://github.com/sagold/json-editor/tree/main/packages/rje-widgets)
![Types](https://badgen.net/npm/types/@sagold/rje-widgets)

```tsx
import { JsonForm } from '@sagold/react-json-editor';
import { widgets } from '@sagold/rje-widgets';
import '@sagold/rje-widgets/rje-widgets.css';

function MyForm({ schema, data }) {
  return (
    <JsonForm
      widgets={widgets}
      schema={schema}
      data={data}
      onChange={(data) => {
        console.log('data', data);
      }}
    />
  );
}
```
