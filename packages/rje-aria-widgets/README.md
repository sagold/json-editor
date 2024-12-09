<p align="center">
  <img src="./src/docs/images/he-full-2000x564.png" width="100%" alt="rje-aria-widgets"><br />
  <img src="./src/docs/images/title-widgets-700x76.png" width="350px" alt="rje-aria-widgets">
</p>

> Simple and extensible React component capable of using JSON Schema to declaratively build and customize user forms.

install

`yarn add @sagold/rje-aria-widgets`

[![Npm package version](https://badgen.net/npm/v/@sagold/rje-aria-widgets)](https://github.com/sagold/json-editor/tree/main/packages/rje-aria-widgets)
![Types](https://badgen.net/npm/types/@sagold/rje-aria-widgets)

This library of components and widgets comes unstyled, but different css files can be combined to add basic styling or a full dark and light theme.

```tsx
import { JsonForm, widgets } from '@sagold/rje-aria-widgets';
import '@sagold/rje-aria-widgets/dist/styles.css';

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
