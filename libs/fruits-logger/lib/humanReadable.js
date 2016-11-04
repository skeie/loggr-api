'use strict';

const util = require('util');
const chalk = require('chalk');
const dateFormat = require('dateformat');

const colorize = {
    FATAL: chalk.magenta,
    ERROR: chalk.red,
    WARN: chalk.yellow,
    INFO: chalk.green,
    DEBUG: chalk.blue,
    TRACE: chalk.gray,
};

module.exports = function humanReadble (json) {
    const parsed = JSON.parse(json);
    const time = dateFormat(parsed['@timestamp'], 'HH:MM:ss.l');
    let message = `[${time}] [${parsed.level}] ${parsed.logger ? `[${parsed.logger}] ` : ''}- ${parsed.message}`;

    if (parsed.throwable) {
        message = `${message} - ${parsed.throwable}`;
    }

    if (parsed.extras) {
        message = `${message} - ${util.inspect(parsed.extras)}`;
    }

    return colorize[parsed.level](message);
};
