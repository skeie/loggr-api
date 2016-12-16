const pg = require('./db-handler');
const jackrabbit = require('jackrabbit');
const logger = require('./fruits-logger');
const EventEmitter = require('events').EventEmitter;

function Connector(config) {
    EventEmitter.call(this);

    const self = this;
    let readyCount = 0;

    this.db = pg.initialize(config).db;
    pg.ping()
        .then(() => {
            logger.info('Postgres connected');
            ready();
        })
        .catch((error) => {
            logger.error('Postgres connection failed', error);
            lost();
        });

    this.queue = jackrabbit(config.RABBIT)
        .on('connected', () => {
            logger.info('Rabbit connected');
            ready();
        })
        .on('error', (err) => {
            logger.error('RabbitMQ error', err);
        })
        .on('disconnected', (err) => {
            logger.error('Failed to connect to rabbit', err);
            lost();
        });

    function ready() {
        if (++readyCount === 2) { // eslint-disable-line
            self.emit('ready');
        }
    }

    function lost() {
        self.emit('lost');
    }
}

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = (config) => new Connector(config);
