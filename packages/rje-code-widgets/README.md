<p align="center">
  <img src="https://github.com/sagold/json-editor/blob/main/packages/react-json-editor/docs/he-full-2000x564.png?raw=true" width="100%" alt="_react-json-editor">   
  <img src="../../images/title-rje-code-widgets-700.png" width="350px" alt="rje-code-widgets">
</p>

> Additional code widgets for [@sagold/react-json-editor](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor) to edit code formatted strings, json and json with json-schema validation using [CodeMirror](https://codemirror.net/) and [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror).

<p align="center">
  <a href="#json-widget">Json Widget</a> |
  <a href="#widget-options">Widget Options</a> |
  <a href="#custom-code-widgets">Custom Code Widget</a>
</p>

install

`yarn add @sagold/rje-code-widgets`

[![Npm package version](https://badgen.net/npm/v/@sagold/rje-code-widgets)](https://github.com/sagold/json-editor/tree/main/packages/rje-code-widgets)
![Types](https://badgen.net/npm/types/@sagold/rje-code-widgets)
![minified](https://badgen.net/bundlephobia/min/@sagold/rje-code-widgets)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@sagold/rje-code-widgets)

include css

```css
@import "@sagold/rje-code-widgets/rje-code-widgets.css";
```


## Json Widget

> Specific code editor supporting json syntax highlighting, linting and inline json-schema validation. The editor supports all kinds of data and json as strings.

To add the plugin to available widgets you have to pass it to the widget plugin registry:

```tsx
import { defaultWidgets } from "@sagold/react-json-editor";
import { JsonWidgetPlugin } from "@sagold/rje-code-widgets";

<JsonForm widgets={[JsonWidgetPlugin, ...defaultWidgets]} />
```

To use the plugin for a specific json-schema use `"format": "json`:

```json
{
  "type": "object",
  "format": "json",
  "properties": {}
}
```

Or use the inline option to trigger the editor by `widget: "json"`:

```tsx
import { Widget } from "@sagold/react-json-editor";

<Widget node={node} editor={editor} options={{ widget: "json" }} />
```

For information on widgets see [@sagold/react-json-editor#widgets](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor#widgets)


## Widget Options

> You can configure your editor within your json-schema using the _options_ property. JsonWidget supports all [defaultOptions](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor#widget-options) where approriate. What follows is a list of additionally supported options by _JsonWidget_:


### `liveUpdate: boolean`

With `"liveUpdate": true` JsonWidget will commit every changed character back to the editor. Default behaviour is to send data in blur, which can also be set explicetly by `"liveUpdate": false`, e.g.

```json
{
  "type": "array",
  "format": "json",
  "options": { 
    "liveUpdate": true
  }
}
```

### `height: number`

Set the height of the code editor to a specific value


### `indentWithTab: boolean`

Set to `true`, if the editor should indent using tabs instead of spaces


### `minHeight: number`

Set the minimum height of the code editor to a specific value


### `maxHeight: number`

Set the maximum height of the code editor to a specific value


### `schema: JSONSchema`

JsonWidget exclusive json-schema for a json type _string_ which consists of stringified json-data. Pass either a valid json-schema or a reference to your local schema, e.g. 

```json
{
  "type": "string",
  "format": "json",
  "default": "{}",
  "options": { 
    "schema": { "$ref": "#/$defs/inline-json" } 
  },
  "$defs": {
    "inline-json": {
      "type": "object"
    }
  }
}
```


### `setup: ReactCodeMirrorProps['basicSetup']`

JsonWidget passes all basicSetup options to react-codemirror, e.g.

```json
{
  "type": "object",
  "format": "json",
  "options": { 
    "setup": {
      "lineNumbers": false,
      "highlightActiveLineGutter": true,
      "closeBrackets": true,
      "autocompletion": false
    }
  }
}
```

For more details see the [props documentation of @uiw/react-codemirror](https://github.com/uiwjs/react-codemirror#props).



### `theme: "light" | "dark"`

Renders the editor in a _light_ or _dark_ theme, where _light_ is the default.



## Custom Code Widgets

> Code widgets have to be created manually for your specific languages. For this, a createCodeWidget helper is exposed.

- _extensions_ documentation: https://github.com/uiwjs/react-codemirror#support-language


**create a custom code widget**

```tsx
import { JsonForm, defaultWidgets } from "@sagold/react-json-editor";
import { createCodeWidgetPlugin } from "@sagold/rje-code-widgets";
import { linter, lintGutter } from '@codemirror/lint';
import { css } from "@codemirror/lang-css";

const CssCodeWidgetPlugin = createCodeWidgetPlugin({
  extensions: [css(), lintGutter()],
  format: "css"
});

function Form(schema, data) {
  return <JsonForm
    schema={schema}
    data={data} 
    widgets={[CssCodeWidgetPlugin, ...defaultWidgets]}
  />;
}
```



