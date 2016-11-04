'use strict';

const { str } = require('envalid');

// This is just used for testing k8s ConfigMap, please ignore

module.exports = {
    DB: str({
        desc: 'Database connection',
        default: 'postgres://postgres@localhost/routes-dev',
    }),
};
