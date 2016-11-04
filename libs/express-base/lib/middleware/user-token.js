'use strict';
const logger = require('../../../fruits-logger');

module.exports = function loginTokenMiddleware (env) {

    // TODO: get token name by env
    const tokenCookieName = '__routyfruity_env';

    return function (req, res, next) {
        if (!req.cookies) {
            logger.warn('loginTokenMiddleware requires cookie-parser middleware to run first');
        }
        req.userToken = getTokenFromRequest(tokenCookieName, req);
        next();
    };
};


const BEARER_REGEX = /Bearer\s+/i;
function getTokenFromRequest (tokenCookieName, req) {
    const authorization = req.headers && req.headers.authorization;

    if (authorization && BEARER_REGEX.test(authorization)) {
        logger.debug('User token: Using authorization header');
        return authorization.replace(BEARER_REGEX, '');
    }

    if (req.cookies) {
        logger.debug('User token: Using cookie');
        return req.cookies[tokenCookieName];
    }
    return null;
}

module.exports.getTokenFromRequest = getTokenFromRequest;
