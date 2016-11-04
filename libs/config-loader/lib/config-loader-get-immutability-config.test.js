'use strict';

const assert = require('power-assert');

const { str } = require('envalid');
const pkg = {};
const { initConfig } = require('./config-loader')(pkg);

function getImmutabilityTestConfig () {
    const schema = {
        STRING: str(),
    };

    const env = {
        STRING: 'test',
    };

    return initConfig(schema, env);
}

describe('Config object immutability', () => {
    it('should throw when accessing non-extant prop', () => {
        const config = getImmutabilityTestConfig();
        assert.throws(() => {
            config.NOT_SET_CONFIG_STRING; // eslint-disable-line no-unused-expressions
        });
    });

    it('should not throw when accessing extant prop', () => {
        const config = getImmutabilityTestConfig();
        let val;
        assert.doesNotThrow(() => {
            val = config.STRING;
        });
        assert(val === 'test');
    });

    it('should throw attempting to change an extant prop', () => {
        const config = getImmutabilityTestConfig();
        assert(config.STRING);
        assert.throws(() => {
            config.STRING = 'changed';
        });
    });

    it('should throw attempting to add a prop', () => {
        const config = getImmutabilityTestConfig();
        assert.throws(() => {
            config.NEW_STRING = 'lol';
        });
    });
});
