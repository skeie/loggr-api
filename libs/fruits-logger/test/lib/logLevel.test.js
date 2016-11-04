import test from 'ava';

import logLevel from '../../lib/logLevel';

test.beforeEach(() => {
    logLevel.setLogLevel(logLevel.logLevels.INFO);
});

test('default should log', t => {
    t.true(logLevel.shouldLog(logLevel.logLevels.INFO));
});

test('should not log lower level than set', t => {
    t.true(!logLevel.shouldLog(logLevel.logLevels.TRACE));
});

test('should not log if turned off', t => {
    logLevel.setLogLevel(logLevel.logLevels.OFF);
    t.true(!logLevel.shouldLog(logLevel.logLevels.INFO));
    logLevel.setLogLevel(logLevel.logLevels.ON);
    t.true(logLevel.shouldLog(logLevel.logLevels.INFO));
});

test('should throw if unknown log level', t => {
    t.throws(() => logLevel.setLogLevel('UNKNOWN'),
        'Invalid log level, should be one of FATAL, ERROR, WARN, INFO, DEBUG, TRACE, ON, OFF, was "UNKNOWN".');
});

test('should export correct log levels', t => {
    t.deepEqual(logLevel.logLevels, {
        FATAL: 'FATAL',
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',
        DEBUG: 'DEBUG',
        TRACE: 'TRACE',
        ON: 'ON',
        OFF: 'OFF',
    });
});
