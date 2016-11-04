'use strict';

let loggingOn = true;
let logLevel = 3;

const logLevels = {
    FATAL: 'FATAL',
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    TRACE: 'TRACE',
};

const levels = Object.keys(logLevels);
const validLogLevels = levels.concat('ON', 'OFF').join(', ');

const isLogLevelAboveThreshold = level => levels.indexOf(level) <= logLevel;

module.exports.logLevels = Object.assign({ ON: 'ON', OFF: 'OFF' }, logLevels);

module.exports.shouldLog = level => loggingOn && isLogLevelAboveThreshold(level);

module.exports.setLogLevel = function setLogLevel (level) {
    switch (level) {
        case 'OFF':
            loggingOn = false;
            break;
        case 'ON':
            loggingOn = true;
            break;
        default:
            logLevel = levels.indexOf(level);
    }

    if (logLevel < 0) {
        throw new Error(`Invalid log level, should be one of ${validLogLevels}, was "${level}".`);
    }
};
