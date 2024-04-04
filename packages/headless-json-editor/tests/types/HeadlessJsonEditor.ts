import { HeadlessEditor } from "../../src/HeadlessEditor";

const editor = new HeadlessEditor({ schema: { type: "object" } });

// test overload function
const rootNode = editor.getNode(); // return type Node
console.log(rootNode.pointer);

const node = editor.getNode("/title"); // return type Node | JsonError
console.log(node.pointer);
