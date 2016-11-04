'use strict';

const { str, num } = require('envalid');

module.exports = {
    RABBIT: str({
        desc: 'RabbitMQ connection',
        default: 'amqp://localhost',
    })
};
