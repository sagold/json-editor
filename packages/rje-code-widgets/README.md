<p align="center">
    <img src="https://github.com/sagold/json-editor/blob/main/packages/react-json-editor/docs/he-full-2000x564.png?raw=true" width="100%" alt="_react-json-editor">   
</p>


# rje-code-widgets

> code widgets for [@sagold/react-json-editor](https://github.com/sagold/json-editor/tree/main/packages/react-json-editor)

install

`yarn add @sagold/rje-code-widgets`;

include css

```css
@import "@sagold/rje-code-widgets/index.css";
```


## JsonWidget

> json widget with linting support for json and json-schema

```tsx
import { JsonForm, defaultWidgets } from "@sagold/react-json-editor";
import { JsonWidgetPlugin } from "@sagold/rje-code-widgets";

function Form(schema, data) {
    return <JsonForm
        schema={schema}
        data={data} 
        widgets={[JsonWidgetPlugin, ...defaultWidgets]}
    />;
}
```

**using widget for stringified json**

set `"format": "json` on a string. You can pass a json-schema in options for json-schema validation.

```json
{
    "type": "object",
    "properties": {
        "data": {
            "type": "string",
            "format": "json",
            "options": {
                "schema": { "type": "object" }
            }
        }
    }
}
```

**using widget for any data**

as before, set `"format": "json"` to trigger editor. Note that data can only be saved if the json is valid.

```json
{
    "type": "object",
    "properties": {
        "data": {
            "type": "object",
            "format": "json"
        }
    }
}
```


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



