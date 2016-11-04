'use strict';

const { bool, num } = require('envalid');

module.exports = {
    CSRF_PROTECTION_ENABLED: bool({
        desc: 'Enable to activate CSRF-protection',
        default: true,
    }),
    SECURE_CSRF_COOKIE_ENABLED: bool({
        desc: 'Eanble to require HTTPS for cookie transfers',
        default: true,
        devDefault: false,
    }),
    ENFORCE_HTTPS_ENABLED: bool({
        desc: 'Enable to upgrade HTTP GET requests to HTTPS',
        default: false,
        devDefault: false,
    }),
    MAX_CONTENT_LENGTH: num({
        desc: 'Stop requests with content length above this number',
        default: 50 * 1024 * 1024,
    }),
    VALIDATE_REDIRECTS_ENABLED: bool({
        desc: 'Enable to validate all redirects in the application',
        default: true,
    }),
    GLOBAL_CORS_ENABLED: bool({
        desc: 'Enable to allow all CORS requests',
        default: true,
    }),
};
