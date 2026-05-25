/* global process */
const path = require('path');
const fs = require('fs');

const ignorePackages = ['doc-generator'];

// fetch all packages
module.exports = () =>
    fs
        .readdirSync(path.resolve(process.cwd(), 'packages'), { withFileTypes: true })
        .filter(
            (d) => d.isDirectory(),
            !ignorePackages.includes(d.name) &&
                fs.existsSync(path.resolve(process.cwd(), 'packages', d.name, 'package.json'))
        )
        .map((d) => d.name);
