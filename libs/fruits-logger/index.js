'use strict';

const path = require('path');
const readPkg = require('read-pkg');
const readPkgUp = require('read-pkg-up');

const createMessage = require('./lib/createMessage');
const logLevel = require('./lib/logLevel');
const humanReadable = require('./lib/humanReadable');

// prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];

const parentModule = module.parent.filename || undefined;
const parentDir = parentModule ? path.dirname(parentModule) : undefined;
const pkgName = parentDir ? readPkgUp.sync(parentDir).pkg.name : undefined;

let topLevelApp;

try {
    topLevelApp = readPkg.sync(process.cwd()).name;
} catch (e) {
    // ignored
}

const useJson = process.env.LOG_FORMAT === 'json';

function log (level, message, error, data) {
    if (!logLevel.shouldLog(level)) {
        return;
    }

    const formattedMessage = createMessage(level, message, error, data, pkgName, parentModule, topLevelApp);

    if (useJson) {
        console.log(formattedMessage);
    } else {
        console.log(humanReadable(formattedMessage));
    }

    return formattedMessage;
}

module.exports.trace = log.bind(null, 'TRACE');
module.exports.debug = log.bind(null, 'DEBUG');
module.exports.info = log.bind(null, 'INFO');
module.exports.warn = log.bind(null, 'WARN');
module.exports.error = log.bind(null, 'ERROR');
module.exports.fatal = log.bind(null, 'FATAL');

module.exports.setLogLevel = logLevel.setLogLevel;
module.exports.logLevels = logLevel.logLevels;
