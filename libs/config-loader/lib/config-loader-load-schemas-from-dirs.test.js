'use strict';

const assert = require('power-assert');

const pkg = {};
const packageDir = process.cwd();
const { loadSchemasFromDirs } = require('./config-loader')(pkg, packageDir);

const fixtureDir = './test/fixtures/config/';

describe('Loading schemas from fs', () => {
    it('should create config object when valid schema and env', () => {
        const schemas = loadSchemasFromDirs(fixtureDir);
        assert.deepEqual(Object.keys(schemas).sort(), ['first', 'second']);
        const { first, second } = schemas;
        assert(first.FIRST);
        assert(second.SECOND);
    });
});
