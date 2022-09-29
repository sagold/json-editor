yarn global add nx
npx create-nx-workspace --preset=ts
nx generate @nrwl/js:library --name=headless-json-editor --buildable --publishable --preset=ts
yarn add -D @nrwl/react
nx g @nrwl/react:lib react-json-editor --publishable --preset=ts

## changes to ts-config in headless-json-editor

- [add] "noImplicitAny": false
- [remove] "noPropertyAccessFromIndexSignature": true


## actions

rename repository: https://nx.dev/packages/workspace/generators/move

```sh
nx g @nrwl/workspace:move --project headless-json-editor _headless-json-editor
```

## references

- https://nx.dev/getting-started/nx-core
- https://nx.dev/getting-started/nx-and-react
- https://nx.dev/getting-started/nx-and-typescript
- https://whoisryosuke.com/blog/2022/using-nx-for-react-and-typescript-monorepos/
- https://nx.dev/packages/react
