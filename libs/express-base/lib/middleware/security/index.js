'use strict';

const connect = require('connect');
const addCsrfToken = require('./add-csrf-token');
const csurf = require('csurf');
const maxContentLength = require('./max-content-length');
const headers = require('./headers');
const enforceHttps = require('./enforce-https');
const mung = require('express-mung');
const verifyRedirects = require('./verify-redirects');
const cors = require('./cors');
const unlessPathMatches = require('./unless-path-matches');

const EXCLUDE_REGEXP = /^\/internal-backstage/;

module.exports = function (config = {}) {
    const chain = connect();
    if (config.validateRedirects) {
        chain.use(mung.headers(verifyRedirects(config.validateRedirectHostnameWhitelist)));
    }
    chain.use(maxContentLength(config.maxContentLength));
    if (config.enforceHttps) {
        chain.use(unlessPathMatches(EXCLUDE_REGEXP, enforceHttps()));
    }
    chain.use(headers(config.headers));
    if (config.csrfProtection) {
        chain.use(csurf({
            cookie: {
                httpOnly: true,
                secure: config.useSecureCsrfCookie,
            },
        }));
        chain.use(addCsrfToken);
    }
    if (config.enableGlobalCors) {
        chain.use(cors);
    }
    return chain;
};
