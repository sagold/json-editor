#!/usr/bin/env node
const path = require('path');
const sh = require('./sh');

async function publishPackages() {
    const cmd = `npm publish`;
    console.log(await sh(cmd, path.resolve('./packages/headless-json-editor')));
    console.log(await sh(cmd, path.resolve('./packages/react-json-editor')));
    console.log(await sh(cmd, path.resolve('./packages/rje-code-widgets')));
}

publishPackages();
