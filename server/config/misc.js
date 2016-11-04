'use strict';

const { bool } = require('envalid');

module.exports = {
    COOKIE_CLEANER_ENABLED: bool({
        desc: 'Enable to include a script cleaning up extraneous cookies',
        default: true,
        devDefault: false,
    }),

    WEB_STACK_TRACES_ENABLED: bool({
        desc: 'Enable to show stack traces in the browser on error pages',
        default: false,
        devDefault: true,
    }),
};
