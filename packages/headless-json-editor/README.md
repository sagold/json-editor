<p align="center">
    <img src="./docs/he-full-blue-2000x564.png" width="100%" alt="headless-json-editor"><br />
    <img src="./docs/title-700x54.png" width="350px" alt="headless-json-editor">
</p>

<p align="center"><b>A simple beautiful api for your custom form generator powered by json-schema</b></p>
<p align="center">
    <a href="#introduction">introduction</a> | <a href="#api">api</a> | <a href="#plugins">plugins</a> | <a href="#utilities">utilities</a> | <a href="#advanced">advanced</a>
</p> 

install

`yarn add headless-json-editor`

[![Npm package version](https://badgen.net/npm/v/headless-json-editor)](https://github.com/sagold/headless-json-editor/actions/workflows/ci.yaml)
![Types](https://badgen.net/npm/types/headless-json-editor)

quick overview

```ts
import { HeadlessEditor } from 'headless-json-editor';

const jsonSchema = { type: 'array', items: { type: 'string' } };
const he = new HeadlessEditor({ schema: jsonSchema, data: ['first item'] });
let rootNode = he.getState();
rootNode = he.setValue('#/1', 124);

render(rootNode);
```

<details><summary>show rootNode</summary>

```json
{
  "id": "686f3a2e-6d99-4f32-bd16-1e965431fc52",
  "type": "array",
  "pointer": "#",
  "property": "#",
  "schema": {
    "type": "array",
    "items": {
      "type": "string"
    }
  },
  "options": {
    "disabled": false,
    "hidden": false
  },
  "children": [
    {
      "id": "29de15eb-cb22-44c3-bc73-74fde9ccec7f",
      "type": "string",
      "pointer": "#/0",
      "property": "0",
      "options": {
        "disabled": false,
        "hidden": false
      },
      "schema": {
        "type": "string"
      },
      "value": "first item",
      "errors": []
    },
    {
      "id": "20a3e4e5-2995-4065-8e2b-db380b6463ac",
      "type": "number",
      "pointer": "#/1",
      "property": "1",
      "options": {
        "disabled": false,
        "hidden": false
      },
      "schema": {
        "type": "string"
      },
      "value": 124,
      "errors": [
        {
          "type": "error",
          "name": "TypeError",
          "code": "type-error",
          "message": "Expected `124` (number) in `#/1` to be of type `string`",
          "data": {
            "received": "number",
            "expected": "string",
            "value": 124,
            "pointer": "#/1"
          }
        }
      ]
    }
  ],
  "errors": []
}
```


</details>    


## introduction

From your input data and schema `headless-json-editor` creates a tree-data-structure that reflects the input data. Each node within this tree is a data-point containing either children (object or array//parent node) or the property value (leaf node//value node) and its json-schema. Thus each tree also contains your state of data. You can retrieve the data of a tree or node anytime using `getData(node)`.

The functional api works on a tree. Functions that modify a tree will always return a new tree, supporting immutable data. Note, new trees are generated shallow, thus you should not edit nodes directly unless this is on purpose.


## api

> functional helpers exposed with instance that change state


create a new node tree from the passed data

```ts
const newRootNode = he.create(data);
```

change value at a specific location in data

```ts
const newRootNode = he.setValue("#/pages/0/title", data);
```

remove value at specific location in data

```ts
const newRootNode = he.removeValue("#/pages/3");
```

move an array item to another index

```ts
const newRootNode = he.moveItem("#/pages/2", 0);
```

create and append  an new item to an array using the passed json schema 

```ts
const newRootNode = he.appendItem(arrayNode, schema);
```

get possible child schemas to add for given node

```ts
const jsonSchemas = he.getArrayAddOptions(node);
```

create data that validates against the current json-schema

```ts
const data = he.getTemplateData();
```


## plugins

> plugin api and exposed plugins 

**OnChangePlugin**

**RemoteEnumOptionsPlugin**


## utilities

> functional helpers that do not change state

get all errors

```ts
const validationErrors = errors(root);
```

find a node

```ts
const node = findNode(root, node => node.property === "this one");
```

get all nodes in a flat list

```ts
const allNodes = getNodeList(root);
```

get a specific node by its path

```ts
const target = getNode(root, "#/page/header");
```

get a childnode by property or index

```ts
const page = getChildNode(root, "page");
```

get json data starting from node

```ts
const jsonData = getData(root);
```

get all nodes along the path

```ts
const [rootNode, page, header, title] = getNodeTrace(root, "#/page/header/title");
```


## advanced

> transformation functions that modify state

```ts
import { Draft07 } from "json-schema-library";
const draft = new Draft07(jsonSchema);
```

create node tree from schema and data

```ts
const currentRootNode = createNode(draft, data);
```

move an array item by index

```ts
const [newRootNode, changes] = moveNode(draft, currentRootNode, "#/items", 2, 1);
```

delete data at location

```ts
const [newRootNode, changes] = removeNode(draft, currentRootNode, "#/page/header");
```

set value at location

```ts
const [newRootNode, changes] = setValue(draft, currentRootNode, "#/page/header", { text: "hey" });
```

