'use strict';
/**
* Postgres database handler.
* For newbz: https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example
*/
const Promise = require('bluebird');
const logger = require('../fruits-logger');
const options = {
    promiseLib: Promise, // overriding the default (ES6 Promise);
};

// IMPORTANT this must be a singleton
let db = null;

const initialize = (config) => {
    
    // because singleton
    if (db) { return { db }; }

    logger.info('Connecting to postgres: ', config.pgUrl);

    const psqlUrl = config.pgUrl;
    const pgp = require('pg-promise')(options); //eslint-disable-line

    db = pgp(psqlUrl);

    if (config.isDev) {
        const monitor = require('pg-monitor');

        monitor.attach(options, ['error', 'query']); // attach to all query events;
        // See API: https://github.com/vitaly-t/pg-monitor#attachoptions-events-override

        monitor.setTheme('matrix'); // change the default theme;
        // Other themes: https://github.com/vitaly-t/pg-monitor/wiki/Color-Themes

        monitor.log = function (/* msg, info*/) {
            // save the screen messages into your own log file;
            // logger.debug(msg, info);
        };
    }

    return { db };
};

const ping = () => db.oneOrNone('SELECT \'DBD::Pg ping test\'');

module.exports = {
    initialize,
    ping,
};
