#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const IS_SEMVER = /\d+\.\d+\.\d+/;

const version = process.argv[process.argv.length - 1];
if (version == null || !IS_SEMVER.test(version)) {
    console.log(`input error: expected an argument matching a semver version '\\d+.\\d+.\\d+'`);
    process.exit();
}

// fetch all packages
const packages = fs
    .readdirSync(path.resolve(process.cwd(), 'packages'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.resolve(process.cwd(), 'packages', d.name, 'package.json')))
    .map((d) => d.name);

// set version nuber of package and monorepo dependencies
async function setVersion(version) {
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
