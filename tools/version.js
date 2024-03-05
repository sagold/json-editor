#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const sh = require('./sh');
const getPackages = require('./getPackages');
const IS_SEMVER = /\d+\.\d+\.\d+/;

let version = process.argv[process.argv.length - 1];
version = version ? version.replace(/^v+/, "") : version;
if (version == null || !IS_SEMVER.test(version)) {
    console.log(`input error: expected an argument matching a semver version '\\d+.\\d+.\\d+'`);
    process.exit();
}

// set version nuber of package and monorepo dependencies
function setVersion(version) {
    const packages = getPackages();
    packages.forEach((pkgName) => {
        const pathToPkg = path.resolve(process.cwd(), 'packages', pkgName, 'package.json');
        const json = JSON.parse(fs.readFileSync(pathToPkg));
        json.version = version;
        Object.keys(json.dependencies).forEach((name) => {
            if (packages.includes(name.replace(/@sagold\//, ''))) {
                json.dependencies[name] = `^${version}`;
            }
        });
        json.peerDependencies &&
            Object.keys(json.peerDependencies).forEach((name) => {
                if (packages.includes(name.replace(/@sagold\//, ''))) {
                    json.peerDependencies[name] = `^${version}`;
                }
            });
        fs.writeFileSync(pathToPkg, JSON.stringify(json, null, 4));
    });
}

setVersion(version);
sh(`git add ./packages/*/package.json && git commit -m 'release: bump version to ${version}' && git tag v${version}`)
    .then(console.log)
    .catch(console.log);
