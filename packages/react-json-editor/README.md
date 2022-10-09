<p align="center">
    <img src="./docs/he-full-2000x564.png" width="100%" alt="_react-json-editor"><br />
    <img src="./docs/title-react-700x76.png" width="350px" alt="_react-json-editor">
</p>

<p align="center">
    <a href="https://sagold.github.io/json-editor/">demo</a> |
    <a href="#editor-options">editor options</a> |
    <a href="#editors">editors</a> |
    <a href="#validators">validators</a> |
    <a href="#plugins">plugins</a> |
    <a href="#advanced">advanced</a>
</p>

> Simple React component capable of using JSON Schema to declaratively build and customize user forms.

install `yarn add @sagold/react-json-editor`


```tsx
import { JsonForm } from '@sagold/react-json-editor';
import '@sagold/react-json-editor/json-form.min.css';

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

<details><summary>JsonForm Props</summary>

| Name      | Type                  | Description                                       |
|:----------|:----------------------|:--------------------------------------------------|
| schema    | JsonSchema            | json schema describing data                       |
| data      | any                   | initial data matching json schema                 |
| onChange  | (data, node) => void  | change listener for data updates                  |
| editors   | EditorPlugin[]        | list of editors used to create user form          |
| plugins   | Plugin[]              | list of plugins for headless json editor          |
| draft     | DraftConfig           | json schema draft config (json-schema-library)    |

</details>


# overview

> react implementation of [headless-json-editor](../headless-json-editor) using [semantic-ui](https://semantic-ui.com/)

## editor options

> For individual editor options please refer to the [storybook editor section](https://sagold.github.io/json-editor/?path=/story/editor-arrayeditor--default-editor)

You can pass options to an editor instance using the `options` object on its sub schema. e.g.

```json
{
    "type": "string",
    "options": {
        "title": "Unique Id",
        "disabled": true
    }
}
```

What follows are options that are supported by each editor in this repository and should be supported by a custom editor:

```ts
type DefaultNodeOptions = { 
  /** 
   * Pass in a list of _css classes_ that should be added on the root 
   * element of this editor. Use this to easily identify or style a specific 
   * editor instance. 
   */
  classNames?: string[];

  /** 
   * description of this data point, overwrites description on sub schema 
   */
  description?: string;

  /** 
   * If the form at this data point should be disabled. 
   * Defaults to `false`.
   */ 
  disabled?: boolean;

  /** 
   * Set to `true` if this form should be hidden from rendering. Usually 
   * helpful to hide static variables.
   * Defaults to `false`.
  */
  hidden: boolean;
  
  /** 
   * title of this data point, overwrites title on this sub schema 
   */
  title?: string;
  
  /** 
   * If set to false, will not render a title for this editor.
   * Defaults to `true` 
   */
  showTitle: boolean;

  /** 
   * If set to false, will not render a description for this editor.
   * Defaults to `true` 
   */
  showDescription: boolean;
};
```

In addition, each editor exposes its own options. For more details refer to the [storybook editor section](https://sagold.github.io/json-editor/?path=/story/editor-arrayeditor--default-editor)


## editors

> - default editors
> - add new editors
> - create custom editors


## validation

> - schema validations
> - custom validators


## plugins

> - adding plugins
> - existing plugins
> - create custom plugin


## advanced

### `useJsonEditor` hook

For more control you can create a json-editor using the `useJsonEditor` hook:

```tsx
import { Form } from 'semantic-ui-react';
import { useJsonEditor } from '@sagold/react-json-editor';

function MyForm({ schema, data }) {
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
