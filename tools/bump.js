#!/usr/bin/env node
const path = require('path');
const sh = require('./sh');
const VALID = ['patch', 'minor', 'major'];

const inc = process.argv[process.argv.length - 1];
if (inc == null || !VALID.includes(inc)) {
    console.log(`input error: expected one argument from ${VALID.join(' | ')}`);
    process.exit();
}

async function runVersion(inc) {
    const cmd = `yarn version --${inc} --no-git-tag-version`;
    console.log(await sh(cmd, path.resolve('./packages/headless-json-editor')));
    console.log(await sh(cmd, path.resolve('./packages/react-json-editor')));
    console.log(await sh(cmd, path.resolve('./packages/rje-code-widgets')));
    console.log(await sh(cmd));
}

runVersion(inc);
