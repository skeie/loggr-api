/**
 * MESSAGE BUS
 * ------------
 * Publishers, and handlers should be next to each other
 */
const logger = require('./fruits-logger');
const Promise = require('bluebird');
const uuid = require('node-uuid');
const EventEmitter = require('events').EventEmitter;
const NotifyWorker = require('../worker/workers/NotifyWorker');
const Notifications = require('../worker/workers/Notifications');

const connections = require('./connections');

const NEW_ROUTE_QUEUE = 'create.NEW_ROUTE_QUEUE';

function MessageBus (config) {
    EventEmitter.call(this);

    this.config = config;
    this.connections = connections(config);
    this.connections.once('ready', this.onConnected.bind(this));
    this.connections.once('lost', this.onLost.bind(this));

    this.notifyWorker = new NotifyWorker({ config, dbHandler: this.connections.db });
}

MessageBus.prototype = Object.create(EventEmitter.prototype);

MessageBus.prototype.onConnected = function () {
    let queues = 0;
    const QUEUE_COUNT = 1;
    this.connections.queue.create(NEW_ROUTE_QUEUE, { prefetch: 5 }, onCreate.bind(this));

    function onCreate () {
        if (++queues === QUEUE_COUNT) { this.onReady(); }
    }
};

MessageBus.prototype.onReady = function () {
    logger.info('Message bus ready');
    this.emit('ready');
};

MessageBus.prototype.onLost = function () {
    logger.info('app.lost');
    this.emit('lost');
};

MessageBus.prototype.subscribeToMessageBus = function () {
    logger.debug('Subscribing to queue');
    this.connections.queue.handle(NEW_ROUTE_QUEUE, this.handleNewRoute.bind(this));
    return this;
};


/*
* HANDLERS API
*/

/**
 * @param  {Object} job active, routeId
 * @param  {Function} ack
 */
MessageBus.prototype.handleNewRoute = function (job, ack) {
    try {
        logger.info(`[EXEC JOB] New route`, job);
        const promises = [];

        if (!job.active) {
            promises.push(this.notifyWorker.notify(Object.assign({ command: Notifications.NEW_ROUTE }, job)));
            // promises.push(this.routeWorker.takeShot(job.routeId));
        }
        // promises.push(this.routeWorker.saveDirectionsData({ id: job.routeId }));

        Promise.all(promises)
            .then(() => {
                logger.debug('handleNewRoute() complete');
                ack();
            })
            .catch((error) => {
                logger.warn({what: `handleNewRoute failed`, args: JSON.stringify(job), error});
            });
    } catch (error) {
        logger.warn({what: `handleNewRoute threw up`, args: JSON.stringify(job)}, error);
    }
}


/**
 * PUBLISH API
 */


/**
 * @param  {Object} msg active, routeId
 */
MessageBus.prototype.publishNewRoute = function (msg) {
    logger.info('Publish new route', msg);
    this.connections.queue.publish(NEW_ROUTE_QUEUE, msg);
}


module.exports = function createApp (config) {
    return new MessageBus(config);
};
