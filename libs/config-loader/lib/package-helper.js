'use strict';

const { parse } = require('path');
const readPkgUp = require('read-pkg-up');

const { path, pkg } = readPkgUp.sync({ cwd: process.cwd() });
const pkgDir = parse(path).dir;

if (!path) {
    throw new Error(`Unable to find package.json in any of the folders above ${process.cwd()}`);
}

module.exports = {
    pkg,
    pkgDir,
};
