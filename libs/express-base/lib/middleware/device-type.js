'use strict';

const logger = require('../../../fruits-logger');
const { _detect: bowserDetect } = require('bowser');

function getUaString (req) {
    return (req.headers['user-agent'] || '').toLowerCase();
}

function detectDeviceType (ua) {
    const bowser = bowserDetect(ua);
    const result = {
        isProbablyAndroid: Boolean(bowser.android),
        isProbablyIos: Boolean(bowser.ios),
        isProbablyTablet: Boolean(bowser.tablet),
        isProbablyMobile: Boolean(bowser.mobile),
        isProbablyMobileOrTablet: Boolean(bowser.tablet || bowser.mobile),
    };

    logger.debug(`Detecting browser for ua: ${ua}`, { extras: result });

    return result;
}

function deviceDetectionMiddleware (req, res, next) {
    res.locals.deviceType = detectDeviceType(getUaString(req));
    next();
}

module.exports = deviceDetectionMiddleware;
// visible for testing:
module.exports.detectDeviceType = detectDeviceType;
