'use strict';

const logger = require('../../../fruits-logger');
const PrettyError = require('pretty-error');
const settingGetter = require('../setting-getter');

function getStatusCode (err) {
    if (err && err.code === 'EBADCSRFTOKEN') {
        return 403;
    }

    return 500;
}

module.exports = function () {
    const pe = new PrettyError();
    pe.withoutColors();
    pe.skipNodeFiles();
    pe.skipPackage('express');

    const showStackTraceGetter = settingGetter('WEB_STACK_TRACES_ENABLED');

    return function (error, req, res, next) {
        const showStackTrace = showStackTraceGetter(req);
        let stack;
        let prettyStack;

        if (showStackTrace && error) {
            logger.debug('Showing stack traces in html');

            prettyStack = pe.render(error).trim();
            stack = error.stack;
        }

        /**
         * This uses the callback form of .render to make sure we
         * have not set a header with status until we know
         * that the template rendered successfully. If we set the
         * status immediately, and rendering fails, the next step
         * in the error handling chain is not able to send headers.
         */
        res.send('Something went wrong!');
    };
};
