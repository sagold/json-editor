#!/usr/bin/env node
const path = require('path');
const sh = require('./sh');
const getPackages = require('./getPackages');

async function publishPackages() {
    const packages = getPackages();
    if (process.env.OTP == null) {
        throw new Error('OTP is missing');
    }
    const tag = process.env.TAG ? ` --tag=${process.env.TAG}` : '';
    try {
        const cmd = `npm publish --access=public --otp=${process.env.OTP}${tag}`;
        for (let i = 0; i < packages.length; i += 1) {
            console.log(await sh(cmd, path.resolve(`./packages/${packages[i]}`)));
        }
    } catch (e) {
        console.log('error', e);
    }
}

publishPackages();
