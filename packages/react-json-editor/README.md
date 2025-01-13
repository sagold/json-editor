<p align="center">
  <img src="./docs/he-full-2000x564.png" width="100%" alt="react-json-editor"><br />
  <img src="./docs/title-react-700x76.png" width="350px" alt="react-json-editor">
</p>

> Simple and extensible React component capable of using JSON Schema to declaratively build and customize user forms.

<p align="center">
  <a href="https://sagold.github.io/json-editor/">demo</a> |
  <a href="#overview">overview</a> |
  <a href="#widgets">widgets</a> |
  <a href="#validators">validators</a> |
  <a href="#plugins">plugins</a> |
  <a href="#advanced">advanced</a>
</p>

install

`yarn add @sagold/react-json-editor`

[![Npm package version](https://badgen.net/npm/v/@sagold/react-json-editor)](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor)
![Types](https://badgen.net/npm/types/@sagold/react-json-editor)

```tsx
import { useEditor, Widget } from '@sagold/react-json-editor';
import defaultWidgets from '@sagold/rje-mantine-widgets';
import '@sagold/rje-mantine-widgets/dist/styles.css';

function MyForm({ schema, data }) {
  const editor = useEditor({
    schema,
    data,
    widgets: defaultWidgets,
    onChange: (data, state) => {
      console.log('data', data, 'root', state);
    }
  });
  return (
    <div className="rje rje-form rje-theme rje-theme--light">
      <Widget editor={editor} />
    </div>
  );
}
```

**useEditor Props**

Only required property is a valid json-schema passed to `schema`.

| Name       | Type                       | Description                                        |
| :--------- | :------------------------- | :------------------------------------------------- |
| schema     | JsonSchema                 | json schema describing data                        |
| cacheKey   | string                     | optionally change key to completely recreate form  |
| data       | any                        | initial data matching json schema                  |
| draft      | DraftConfig                | json schema draft config (json-schema-library)     |
| liveUpdate | boolean                    | omit changes for each keystroke instead of on blur |
| disabled   | boolean                    | true to disabled whole form                        |
| onChange   | (data, node, editor): void | change listener for data updates                   |
| options    | extends DefaultNodeOptions | options to override for root widget                |
| plugins    | Plugin[]                   | list of plugins for json editor                    |
| validate   | boolean                    | set to true to validate and show errors on create  |
| widgets    | WidgetPlugin[]             | list of widgets used to create user form           |

# overview

> react implementation of [headless-json-editor](../headless-json-editor) using [react-aria](https://react-spectrum.adobe.com/react-aria/)

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
   * If the form at this data point is required. Will display a required icon.
   * Defaults to `false`.
   */
  required?: boolean;

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

_Options passed through component_

Note that when rendering a widget using the _widget_ decorator, options can be overriden within the rendering cycle. Thus, it is recommended to access the options from `props` instead of _node.options_.

### widget registry

**list of widgets that test a schema**
json-editor works on a list of widgets that are used to render each json sub-schema. Thus, to fully support a user form for any json-schema we will need to have a widget for any of those types, be it for a simple string `{ "type": "string" }` or a complex object `{ "type": "object", "properties": { ... } }`. You can also have specialized widgets for compound sub schemas, e.g. an array of strings `{ "type": "array", "items": { "type": "string" }}`. To make this work, json-editor scans the list until of widgets until one widgets registers for the given schema.

**return first matching schema**
With this, very general widgets (string, number, etc) are on the bottom of this list, specialized schemas (image, coordinates, etc) are on top. The first widget returning `true` on `widget.use` will be instantiated with the corresponding schema. Note that, very specialized schemas can encompass multiple subschemas and generic schemas only describe the object or array but pass actual children back to the list of widgets for rendering.

**can modify test of a widget**
json-editor comes with a set of widgets exposed as _defaultWidgets_. These can completely build a user form for any possible json-data. In addtion, some more specialized widgets are exposed and some complex widgets can be added to this list. Just remember that the order is important: first to test `true` will be used to render the user form.

**can modify list of widgets**
Assembling the list of widgets on your own, you can select the widgets available, the order they should be taken and also modify the actual test-function for when to use a widget:

### default widgets

`react-json-editor` comes with a list of default widgets that cover inputs for all possible json-data as well as catching possible data errors and rendering to them into the form. Note that in some cases a specialized widget is required for a better user experience. For this you can add a any editor into the list of default widgets or replace them completely with your own widgets.

The `Jsonform` component add the defaultWidgets per default. If you are using `useEditor` hook you have to pass the defaultWidgets on your own, e.g.

```tsx
import { defaultWidgets, useEditor, Widget } from '@sagold/react-json-editor';

function MyForm({ schema }) {
  const editor = useEditor({ schema, widgets: defaultWidgets });
  return <Widget editor={editor} />;
}
```

### custom widgets

You can create a custom widget for any input data and add a specific function to register for a specific json-schema.

**create your widget**

```tsx
import { widget, WidgetPlugin, StringNode } from '@sagold/react-json-editor';

const MyStringWidget = widget<StringNode, string>(({ node, options, setValue }) => (
  <input
    type="text"
    defaultValue={node.value}
    disabled={options.disabled === true}
    onChange={(e) => {
      setValue(e.target.value);
    }}
  />
));
```

In order to register the widget in `react-json-editor` and hook into specific json-schema a plugin wrapper is required

**create a plugin wrapper for your widget**

```tsx
export const MyStringWidgetPlugin = {
  // a unique id is required for each widget plugin
  id: 'my-widget-plugin',
  // return true to register to this node/schema
  use: (node, options) => node.schema.type === 'string',
  // expose the widget to be rendered with this node
  Widget: MyStringWidget
};
```

For more details check [any default widget](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor/src/lib/widgets) or take a look at the additional widget packages like [rje-code-widgets](https://github.com/sagold/json-editor/tree/main/packages/rje-code-widgets)

## validation

> - schema validations
> - custom validators

## plugins

### adding plugins

```tsx
import { useEditor, Widget, HistoryPlugin } from '@sagold/react-json-editor';

export function Myform({ schema }) {
  const editor = useEditor({
    schema,
    plugins: [HistoryPlugin]
  });
  return <Widget node={root} editor={editor} />;
}
```

or with `useEditorPlugin` hook

```tsx
import { useEditor, useEditorPlugin, Widget, HistoryPlugin } from '@sagold/react-json-editor';

export function Myform({ schema }) {
  const editor = useEditor({ schema });
  const history = useEditorPlugin(editor, HistoryPlugin);
  return <Widget editor={editor} />;
}
```

### existing plugins

#### `EventLoggerPlugin`

> logs every event

#### `HistoryPlugin`

> undo, redo support

```tsx
import { useEditor, useEditorPlugin, Widget, HistoryPlugin } from '@sagold/react-json-editor';

export function Myform({ schema }) {
  const editor = useEditor({ schema });
  const history = useEditorPlugin(editor, HistoryPlugin);
  // history?.undo();
  // history?.redo();
  // history?.history.getUndoCount();
  // history?.history.getRedoCount();
  return <Widget node={root} editor={editor} />;
}
```

#### `OnChangePlugin`

> callback for data changes

```tsx
import { useEditorPlugin, Widget, OnChangePlugin } from '@sagold/react-json-editor';

function MyForm({ schema }) {
  const editor = useEditor({ schema });
  useEditorPlugin(editor, OnChangePlugin, {
    onChange(ast, event, editor) {
      // do something
    }
  });
  return <Widget editor={editor} />;
}
```

Note that an onChangePlugin is added per default.

### create custom plugin

@todo
