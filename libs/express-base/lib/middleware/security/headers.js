'use strict';

const helmet = require('helmet');

const DEFAULTS = {
    contentSecurityPolicy: false,
    dnsPrefetchControl: false,
    frameguard: true,
    hidePoweredBy: true,
    hpkp: false,
    hsts: false,
    ieNoOpen: true,
    noCache: false,
    noSniff: true,
    referrerPolicy: false,
    xssFilter: true,
};

module.exports = function (config = {}) {
    return helmet(Object.assign({}, DEFAULTS, config));
};
