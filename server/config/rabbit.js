'use strict';

const { str, num } = require('envalid');

// TODO: dont do this logic here, configure
// the way its supposed to with config-loader
const rabbitUrl = process.env.RABBITMQ_SERVICE_SERVICE_HOST ?
    // kubernetes URI
    ('amqp://' + process.env.RABBITMQ_SERVICE_SERVICE_HOST + ':' + process.env.RABBITMQ_SERVICE_SERVICE_PORT) :
    process.env.RABBIT_PORT_5672_TCP_ADDR ?
    // docker-compose (local) URI 
    ('amqp://' + process.env.RABBIT_PORT_5672_TCP_ADDR + ':' + process.env.RABBIT_PORT_5672_TCP_PORT) :
    // local
    'amqp://localhost';

module.exports = {
    RABBIT: str({
        desc: 'RabbitMQ connection',
        default: rabbitUrl,
    })
};
