<p align="center">
    <img src="./docs/he-full-blue-2000x564.png" width="100%" alt="headless-json-editor"><br />
    <img src="./docs/title-700x54.png" width="350px" alt="headless-json-editor">
</p>

<p align="center"><b>A simple beautiful api for your custom form generator powered by json-schema</b></p>
<p align="center">
    <a href="#introduction">introduction</a> |
    <a href="#node">node</a> |
    <a href="#api">api</a> | 
    <a href="#plugins">plugins</a> |
    <a href="#functional-api">functional api</a>
</p> 

install

`yarn add headless-json-editor`

[![Npm package version](https://badgen.net/npm/v/headless-json-editor)](https://github.com/sagold/headless-json-editor/actions/workflows/ci.yaml)
![Types](https://badgen.net/npm/types/headless-json-editor)

quick overview

```ts
// stateful api - removes management of json-schema-draft and current state
import { HeadlessEditor } from 'headless-json-editor';

const jsonSchema = { type: 'array', items: { type: 'string' } };
const he = new HeadlessEditor({ schema: jsonSchema, data: ['first item'] });
let rootNode = he.getState();
rootNode = he.setValue('#/1', 124);

// doRender(rootNode);
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

From your input data and json-schema, `headless-json-editor` creates a tree data-structure that reflects your input-data. Each node within this tree is a data-point containing its json-schema and either children (_object_ or _array_ «» _parent node_) or the property value (_leaf node_ «» _value node_). Thus, each tree also contains your state of data. You can retrieve the data of a tree or node anytime using `getData(node)`.

You may work on a node-tree using the functional api. Functions that modify a tree will always return a new tree to support immutable data. Just be aware that new trees are generated shallow so you should not edit nodes directly unless this is on purpose.


## node

get current validation errors of node

```ts
const errors: JsonError[] = node.errors;
```

get json-schema of value

```ts
const schema: JsonSchema = node.schema;
```

get options for current node

```ts
const options = node.options;
```

get current value of valueNode

```ts
const value = node.value;
```

get children of parentNode

```ts
const value = node.children;
```


## api

> stateful api removes management of json-schema-draft, current state and offers a simple interface for plugins

```ts
import { HeadlessEditor } from 'headless-json-editor';

const jsonSchema = { type: 'array', items: { type: 'string' } };
const he = new HeadlessEditor({ schema: jsonSchema, data: ['first item'] });
let rootNode = he.getState();
rootNode = he.setValue('#/1', 124);

render(rootNode);
```

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


### plugins

> plugin-api is supported by stateful-api. Internally, each plugin may use the functional api to modify the current state, passing back a new state and the changes made to stateful-api.

**OnChangePlugin**

```ts
import { HeadlessEditor, OnChangePlugin } from 'headless-json-editor';

const jsonSchema = { type: 'array', items: { type: 'string' } };
const he = new HeadlessEditor({ schema: jsonSchema, data: ['first item'] });
he.addPlugin(OnChangePlugin, {
  onChange(data, rootNode, he) {
    console.log("data changed to", data);
  }
})

he.setValue('#/0', 124);
// log: [124]
```

**HistoryPlugin**

```ts
import { HeadlessEditor, HistoryPlugin } from 'headless-json-editor';

const jsonSchema = { type: 'array', items: { type: 'string' } };
const he = new HeadlessEditor({ schema: jsonSchema, data: ['first item'] });
const history = he.addPlugin(HistoryPlugin);
he.setValue('#/0', 124);

history.undo();
// log: ['first item']

// history.redo();
// history.getUndoCount();
// history.getRedoCount();
```


#### how to write plugins

plugins are function that return an object with a unique `id` and a method `onEvent(Node, PluginEvent)`.

```ts
import { Plugin } from 'headless-json-editor';

export const MyPlugin: Plugin<{ myOption: string }> = (he, options) => {
    return {
        id: "my-plugin-id",
        onEvent(root, event) {
            console.log(options.myOption, event);
        }
    };
};
```

Witin `onEvent` you have access to all events omitted. You can hook into changes and modify the state. When chaning the state you have to pass back a list of changes to the editor for further processing:

```ts
import { Plugin, isChange } from 'headless-json-editor';

export const MyPlugin: Plugin<{ myOption: string }> = ({ draft}, options) => {
    id: "set-option-title-to",
    onEvent(root, event) {
        if (!isChange(event) || event.node.schema["MyKey"] == null) {
            return undefined;
        }
        const node = event.node;
        const target = node.schema["MyKey"];
        const index = node.schema!.enum!.indexOf(node.value as string);
        if (index < 0) {
            return undefined;
        }
        const value = node.schema.options?.enum?.[index];
        const [newAST, changes] = setValue(draft, root, target, value);
        if (isJsonError(newAST)) {
            return undefined;
        }
        // return new root and list of changes
        return [newAST, changes ?? []];
    }
});
```

The last event, the `done`-event, does not accept node-changes. It lists all changes made with the final root node. Use this event to hook into completed update-cycles.

```ts
onEvent(root, event) {
    if (event.type === "done") {
        // do something
    }
}
```

Note, plugins are run sequentially to avoid circular updates. This also means plugin order matters. To break out of the update loop and trigger a fresh update-cycle use the editor's data-update methods, like `setValue` (asynchronously):

```ts
onEvent(root, event) {
    if (isChange(event)) {
        setTimeout(() => {
          he.setValue("#/1", 124);
        });
    }
}
```


## functional api

> functional api requires an instance of a json-schema draft to work with. This instance needs to be passed for all actions that change nodes. In the following example a modified draft `JsonEditor` is used. 
> [@see json-schema-library](https://github.com/sagold/json-schema-library) for more details

quick overview

```ts
import { JsonEditor } from 'json-schema-library';
import { createNode, setValue } from "headless-json-editor";

const jsonSchema = { type: 'array', items: { type: 'string' } };
const draft = new JsonEditor({ schema: jsonSchema, data: ['first item'] });
let rootNode = createNode(draft, ["9fa"])
rootNode = setValue(draft, rootNode, '#/1', 124);

// doRender(rootNode);
```

### create and change state

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


### working with nodes

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




