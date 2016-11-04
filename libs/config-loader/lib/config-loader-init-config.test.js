'use strict';

const assert = require('power-assert');

const { str } = require('envalid');
const pkg = {
    name: 'foo',
    version: '0.0.0',
};
const { initConfig } = require('./config-loader')(pkg);

describe('Initializing config objects', () => {
    it('should create config object when valid schema and env', () => {
        const schema = { STRING: str() };
        const env = { STRING: 'test' };
        const config = initConfig(schema, env);
        assert(config.STRING === 'test');
    });

    it('config should populate APP_NAME and APP_VERSION automatically', () => {
        const config = initConfig({}, {});
        assert(config.APP_NAME === pkg.name);
        assert(config.APP_VERSION === pkg.version);
    });

    it('should filter out stuff from env that is not con config', () => {
        const schema = { };
        const env = { NOT_USED: 'not_used' };
        const config = initConfig(schema, env);
        assert.throws(() => {
            config.NOT_USED; // eslint-disable-line no-unused-expressions
        });
    });
});
