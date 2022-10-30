yarn global add nx
npx create-nx-workspace --preset=ts

nx generate @nrwl/js:library --name=headless-json-editor --buildable --publishable --preset=ts --importPath=headless-json-editor

yarn add -D @nrwl/react
nx g @nrwl/react:lib react-json-editor --preset=ts  --buildable --publishable --importPath=@sagold/react-json-editor
nx g @nrwl/react:storybook-configuration react-json-editor

nx g @nrwl/react:lib rje-code-widget --preset=ts  --publishable --importPath=@sagold/rje-code-widget
nx g @nrwl/react:storybook-configuration rje-code-widget
    

## changes to ts-config in headless-json-editor

- [add] "noImplicitAny": false
- [remove] "noPropertyAccessFromIndexSignature": true


## actions

**rename repository** https://nx.dev/packages/workspace/generators/move

```sh
nx g @nrwl/workspace:move --project headless-json-editor _headless-json-editor
nx g @nrwl/workspace:move --project react-json-editor _react-json-editor
```

**remove repository** https://nx.dev/packages/workspace/generators/remove

```sh
nx g @nrwl/workspace:remove _headless-json-editor --forceRemove
nx g @nrwl/workspace:remove _react-json-editor --forceRemove
nx g @nrwl/workspace:remove test-lib --forceRemove
```


## references

- https://nx.dev/getting-started/nx-core
- https://nx.dev/getting-started/nx-and-react
- https://nx.dev/getting-started/nx-and-typescript
- https://whoisryosuke.com/blog/2022/using-nx-for-react-and-typescript-monorepos/
- https://nx.dev/packages/react
