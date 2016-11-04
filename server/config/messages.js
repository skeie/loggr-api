'use strict';

const { str } = require('envalid');

// This is just used for testing k8s ConfigMap, please ignore

module.exports = {
    BROADCAST_MESSAGE: str({
        desc: 'A message to be displayed as a broadcast',
        default: 'This is the default message',
    }),
};
