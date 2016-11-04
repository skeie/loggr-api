'use strict';

const { str } = require('envalid');

module.exports = {
    KUB_ENVIRONMENT: str({
        desc: 'KUB environment',
        choices: ['dev', 'local', 'prod', 'test'],
        devDefault: 'local',
    }),

    // included for completeness. Apps can use env.is{Production|Dev|Test}
    NODE_ENV: str({
        desc: 'node environment',
        choices: ['development', 'production', 'test'],
        devDefault: 'development',
    }),
};
