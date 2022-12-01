<p align="center">
    <img src="./images/he-full-trans-2000x564.png" width="100%" alt="headless-json-editor"><br />
    <img src="./images/json-editor-700x70.png" width="350px" alt="headless-json-editor">
</p>

> **[json-editor](https://github.com/sagold/json-editor)** is the mono repository around [headless-json-editor](./packages/headless-json-editor)

Currently this repository includes packages

- [headless-json-editor](./packages/headless-json-editor) and
- [@sagold/react-json-editor](./packages/react-json-editor) for a react implementation using semantic-ui
- [@sagold/rje-code-widgets](./packages/rje-code-widgets) additional code-widgets for react-json-editor


## tooling

- run tests `nx test headless-json-editor`
- run storybook `nx run react-json-editor:storybook`
- build storybook `nx run react-json-editor:build-storybook`
- build packages `nx run-many --target=build`
- build react-json-editor `nx run react-json-editor:build`
