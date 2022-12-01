#!/usr/bin/env node
const path = require('path');
const sh = require('./sh');

async function publishPackages() {
    try {
        const cmd = `npm publish`;
        console.log(await sh(cmd, path.resolve('./packages/headless-json-editor')));
        console.log(await sh(cmd, path.resolve('./packages/react-json-editor')));
        console.log(await sh(cmd, path.resolve('./packages/rje-code-widgets')));
    } catch (e) {
        console.log('error', e);
    }
}

publishPackages();
