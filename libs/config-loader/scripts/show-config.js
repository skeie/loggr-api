#!/usr/bin/env node
'use strict';

const yargs = require('yargs');

function stringSorter (a, b) {
    if (a === b) {
        return 0;
    } else {
        return a > b ? 1 : -1;
    }
}

function pairs (dict) {
    return Object.keys(dict).map(e => [e, dict[e]]);
}

function sortedPairs (dict) {
    return pairs(dict).sort(([a], [b]) => stringSorter(a, b));
}

function prettyPrintSchemaItem ([name, opts]) {
    const { desc = 'not set', devDefault = 'not set', type = 'unknown', choices } = opts;
    // can't destructure reserved words with defaults :(
    const theDefault = opts.default === undefined ? 'not set' : opts.default;
    console.log(`  ${name} (type: ${type}) - ${desc}`);
    console.log(`    default: ${theDefault}`);
    console.log(`    devDefault: ${devDefault}`);
    if (choices) {
        console.log(`    choices: ${choices.join(', ')}`);
    }
}

function prettyPrintSchema ([name, items]) {
    console.log(`${name}.js`);
    sortedPairs(items).forEach(prettyPrintSchemaItem);
    console.log();
}


const { pkg, pkgDir } = require('../lib/package-helper');
const configLoader = require('../lib/config-loader');

const { loadSchemasFromDirs } = configLoader(pkg, pkgDir);

const dirPaths = yargs
    .usage('Usage: $0 <dir1> <dir2>...')
    .demand(1)
    .argv
    ._;

const schemas = sortedPairs(loadSchemasFromDirs(...dirPaths));

schemas.forEach(prettyPrintSchema);
