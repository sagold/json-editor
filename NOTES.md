# release

`pnpm run test`
`pnpm run dist`
`pnpm run set-version 1.0.0-rc6`
`pnpm run install`
`npm login`
`OTP=xyz pnpm run publish-all` for rc `TAG=next OTP=xyz pnpm run publish-all`

## prerelease

`TAG=next OTP=xyz yarn publish-all`

# typescript project references

- https://wallis.dev/blog/typescript-project-references
- https://dev.to/mxro/the-ultimate-guide-to-typescript-monorepos-5ap7

# tsc module settings

- https://www.typescriptlang.org/docs/handbook/esm-node.html

# typescript references in webpack

- https://medium.com/@nickexcell/using-typescript-project-references-with-ts-loader-and-webpack-part-1-5d0c3cd7c603
