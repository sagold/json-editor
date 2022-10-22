<p align="center">
    <img src="./docs/he-full-2000x564.png" width="100%" alt="_react-json-editor"><br />
    <img src="./docs/title-react-700x76.png" width="350px" alt="_react-json-editor">
</p>
<p align="center">
    <a href="https://sagold.github.io/json-editor/">demo</a> |
    <a href="#overview">overview</a> |
    <a href="#widgets">widgets</a> |
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

the only required property is a valid json-schema passed to `schema`.

| Name      | Type                  | Description                                       |
|:----------|:----------------------|:--------------------------------------------------|
| schema    | JsonSchema            | json schema describing data                       |
| data      | any                   | initial data matching json schema                 |
| pointer   | string                | json-pointer to root node. Defaults to root ('#') |
| options   | {}&DefaultNodeOptions | options to override for root widget               |
| onChange  | (data, node) => void  | change listener for data updates                  |
| widgets   | WidgetPlugin[]        | list of widgets used to create user form          |
| plugins   | Plugin[]              | list of plugins for json editor                   |
| draft     | DraftConfig           | json schema draft config (json-schema-library)    |

</details>


# overview

> react implementation of [headless-json-editor](../headless-json-editor) using [semantic-ui](https://semantic-ui.com/)



## widgets

<p align="left">
    <a href="#widget-options">widget options</a> | 
    <a href="#widget-registry">widget registry</a> |
    <a href="#default-widgets">default widgets</a> |
    <a href="#custom-widgets">custom widgets</a>
</p>

A user form built with json-editor solely consists of a tree of widgets. Each widget is responsible to render a part of a json-schema.

In many cases a sub schema is completely rendered by a widget, in others they render other widgets (an object rendering properties) and sometimes a widget is used to wrap another widget (seen in oneOfSelectWidget).

So any point in data can be customized with a specific widget, improving usability, adding json-schema features or adding
a fitting preview of the value, e.g. showing a url as image.


### widget options

> For individual widget options please refer to the [storybook widget section](https://sagold.github.io/json-editor/?path=/story/widget-arraywidget--default-widget)

Each widget registers to a sub schema on which an `options` object can be passed directly to a widget instance. e.g.

```json
{
    "type": "string",
    "options": {
        "title": "Unique Id",
        "disabled": true
    }
}
```

What follows are options that are supported by each [default widget](#default-widgets) and should be supported by a [custom widget](#custom-widgets):

```ts
type DefaultNodeOptions = { 
  /** 
   * Pass in a list of _css classes_ that should be added on the root 
   * element of this widget. Use this to easily identify or style a specific 
   * widget instance. 
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
   * If set to false, will not render a title for this widget.
   * Defaults to `true` 
   */
  showTitle: boolean;

  /** 
   * If set to false, will not render a description for this widget.
   * Defaults to `true` 
   */
  showDescription: boolean;
};
```

In addition, each widget exposes its own options. For more details refer to the [storybook widget section](https://sagold.github.io/json-editor/?path=/story/widget-arraywidget--default-widget)


*Options passed through component*

Note that when rendering a widget using the *widget* decorator, options can be overriden within the rendering cycle. This, it is recommended to access the iptions from props, not from node.options.



### widget registry

*list of widgets that test a schema**
json-editor works on a list of widgets that are used to render each json sub-schema. Thus, to fully support a user form for any json-schema we will need to have a widget for any of those types, be it for a simple string `{ "type": "string" }` or a complex object `{ "type": "object", "properties": { ... } }`. You can also have specialized widgets for compound sub schemas, e.g. an array of strings `{ "type": "array", "items": { "type": "string" }}`. To make this work, json-editor scans the list until of widgets until one widgets registers for the given schema. 

**return first matching schema**
With this, very general widgets (string, number, etc) are on the bottom of this list, specialized schemas (image, coordinates, etc) are on top. The first widget returning `true` on `widget.use` will be instantiated with the corresponding schema. Note that, very specialized schemas can encompass multiple subschemas and generic schemas only describe the object or array but pass actual children back to the list of widgets for rendering.

**can modify test of a widget**
json-editor comes with a set of widgets exposed as _defaultWidgets_. These can completely build a user form for any possible json-data. In addtion, some more specialized widgets are exposed and some complex widgets can be added to this list. Just remember that the order is important: first to test `true` will be used to render the user form. 

**can modify list of widgets**
Assembling the list of widgets on your own, you can select the widgets available, the order they should be taken and also modify the actual test-function for when to use a widget:



### default widgets


### custom widgets

> 


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
    onChange: (data, state) => { console.log('data', data, "root", state); }
  });
  const Widget = jsonEditor.getWidget(node);
  return (
    <Form error>
      <Widget node={node} instance={jsonEditor} />
    </Form>
  );
}
```
