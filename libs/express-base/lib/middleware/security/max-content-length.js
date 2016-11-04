'use strict';

const logger = require('../../../../fruits-logger');

const STATUS_CODE = 400;

module.exports = function (maxContentLength) {
    return function (req, res, next) {
        const contentLength = req.headers['content-length'] ? Number(req.headers['content-length']) : null;

        if (contentLength && contentLength > maxContentLength) {
            const message = `Request ${req.method}: ${req.url} stopped due to content length ${contentLength}B. ` +
            `Max content length is currently set to ${maxContentLength}B.`;
            logger.info(message);
            res.sendStatus(STATUS_CODE);
        } else {
            next();
        }
    };
};
