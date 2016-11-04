'use strict';

const { pkg, pkgDir } = require('./package-helper');
const configLoader = require('./config-loader');

module.exports = configLoader(pkg, pkgDir).initConfigFromDirs;
