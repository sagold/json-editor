<p align="center">
  <img src="./src/docs/images/he-full-2000x564.png" width="100%" alt="rje-mantine-widgets"><br />
  <img src="./src/docs/images/title-mantine-widgets-700x76.png" width="350px" alt="rje-mantine-widgets">
</p>

> Simple and extensible React component capable of using JSON Schema to declaratively build and customize user forms using [mantine component library](https://mantine.dev/).

install

`yarn add @sagold/rje-mantine-widgets`

[![Npm package version](https://badgen.net/npm/v/@sagold/rje-mantine-widgets)](https://github.com/sagold/json-editor/tree/main/packages/rje-mantine-widgets)
![Types](https://badgen.net/npm/types/@sagold/rje-mantine-widgets)

This library of components and widgets comes unstyled

```tsx
import { JsonForm, widgets } from '@sagold/rje-mantine-widgets';

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

- [Documentation and Examples](https://sagold.github.io/json-editor/?path=/docs/packages-rje-mantine-widgets-overview--docs)
