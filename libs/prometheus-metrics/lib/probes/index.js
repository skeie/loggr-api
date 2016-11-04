'use strict';

const allProbes = require('require-dir')();

module.exports = Object.keys(allProbes).map(key => allProbes[key]);
