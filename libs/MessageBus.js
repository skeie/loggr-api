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
const RouteWorker = require('../worker/workers/RouteWorker');
const Notifications = require('../worker/workers/Notifications');

const connections = require('./connections');

const NEW_ROUTE_SEND_EMAIL_QUEUE = 'create.NEW_ROUTE_SEND_EMAIL_QUEUE';
const NEW_ROUTE_TAKE_SCREENSHOT_QUEUE = 'create.NEW_ROUTE_TAKE_SCREENSHOT_QUEUE';
const NEW_ROUTE_STORE_DURATION_QUEUE = 'create.NEW_ROUTE_STORE_DURATION_QUEUE';
const NEW_ROUTE_INVALIDATE_REDIS = 'create.CLEAR_CACHE';
const NEW_ROUTE_PUT_SPICES_ON = 'create.NEW_ROUTE_PUT_SPICES_ON';

function MessageBus (config) {
    EventEmitter.call(this);

    this.config = config;
    this.connections = connections(config);
    this.connections.once('ready', this.onConnected.bind(this));
    this.connections.once('lost', this.onLost.bind(this));

    this.notifyWorker = new NotifyWorker({ config, dbHandler: this.connections.db });
    this.routeWorker = new RouteWorker({ config, dbHandler: this.connections.db });
}

MessageBus.prototype = Object.create(EventEmitter.prototype);

MessageBus.prototype.onConnected = function () {
    let queues = 0;
    const QUEUE_COUNT = 5;
    this.connections.queue.create(NEW_ROUTE_SEND_EMAIL_QUEUE, { prefetch: 5 }, onCreate.bind(this));
    this.connections.queue.create(NEW_ROUTE_STORE_DURATION_QUEUE, { prefetch: 5 }, onCreate.bind(this));
    this.connections.queue.create(NEW_ROUTE_TAKE_SCREENSHOT_QUEUE, { prefetch: 5 }, onCreate.bind(this));
    this.connections.queue.create(NEW_ROUTE_INVALIDATE_REDIS, { prefetch: 5 }, onCreate.bind(this));
    this.connections.queue.create(NEW_ROUTE_PUT_SPICES_ON, { prefetch: 5 }, onCreate.bind(this));

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
    this.connections.queue.handle(NEW_ROUTE_SEND_EMAIL_QUEUE, this.handleSendNewRouteEmail.bind(this));
    this.connections.queue.handle(NEW_ROUTE_STORE_DURATION_QUEUE, this.handleStoreDuration.bind(this));
    this.connections.queue.handle(NEW_ROUTE_TAKE_SCREENSHOT_QUEUE, this.handleTakeRouteScreenshot.bind(this));
    this.connections.queue.handle(NEW_ROUTE_PUT_SPICES_ON, this.handlePutSpicesOnRoute.bind(this));

    return this;
};


/*
* HANDLERS API
*/

/**
 * @param  {Object} job routeId
 * @param  {Function} ack
 */
MessageBus.prototype.handleSendNewRouteEmail = function (job, ack) {
    try {
        logger.info(`[EXEC JOB] New route ${job.routeId}`);

        this.notifyWorker.notify(Object.assign({ command: Notifications.NEW_ROUTE }, job))
            .then(() => {
                logger.debug('handleSendNewRouteEmail() complete');
                ack();
            })
            .catch((error) => {
                logger.warn('handleSendNewRouteEmail failed', error, { extras: { args: JSON.stringify(job) } } );
                ack(error);
            });
    } catch (error) {
        logger.warn('handleSendNewRouteEmail threw up', error, { extras: { args: JSON.stringify(job) } } );
        ack(error);
    }
};

/**
 * @param  {Object} job routeId
 * @param  {Function} ack
 */
MessageBus.prototype.handleStoreDuration = function (job, ack) {
    try {
        logger.info(`[EXEC JOB] Store duration ${job.routeId}`);

        this.routeWorker.storeDuration(job)
            .then(() => {
                logger.debug('handleStoreDuration() complete');
                ack();
            })
            .catch((error) => {
                logger.warn('handleStoreDuration failed', error, { extras: { args: JSON.stringify(job) } } );
                ack(error);
            });
    } catch (error) {
        logger.warn('handleStoreDuration threw up', { extras: { args: JSON.stringify(job) } } );
        ack(error);
    }
};

/**
 * @param  {Object} job routeId
 * @param  {Function} ack
 */
MessageBus.prototype.handleTakeRouteScreenshot = function (job, ack) {
    try {
        logger.info(`[EXEC JOB] handleTakeRouteScreenshot ${job.routeId}`);

        this.routeWorker.takeShot(job.routeId)
            .then(() => {
                logger.debug('handleTakeRouteScreenshot() complete');
                ack();
            })
            .catch((error) => {
                logger.warn('handleTakeRouteScreenshot failed', error, { extras: { args: JSON.stringify(job) } } );
                ack(error);
            });
    } catch (error) {
        logger.warn('handleTakeRouteScreenshot threw up', error, { extras: { args: JSON.stringify(job) } } );
        ack(error);
    }
};

/**
 * @param  {Object} job routeId
 * @param  {Function} ack
 */
MessageBus.prototype.handlePutSpicesOnRoute = function (job, ack) {
    try {
        logger.info(`[EXEC JOB] handlePutSpicesOnRoute ${job.routeId}`);

        this.routeWorker.putSpicesOnRoute(job.routeId)
            .then(() => {
                logger.debug('handlePutSpicesOnRoute() complete');
                ack();
            })
            .catch((error) => {
                logger.warn('handlePutSpicesOnRoute failed', error, { extras: { args: JSON.stringify(job) } } );
                ack(error);
            });
    } catch (error) {
        logger.warn('handlePutSpicesOnRoute threw up', error, { extras: { args: JSON.stringify(job) } } );
        ack(error);
    }
};


/**
 * PUBLISH API
 */


/**
 * @param  {Object} msg routeId
 */
MessageBus.prototype.publishNewRoute = function (msg) {
    logger.info('Publish new route', { extras: msg });
    this.connections.queue.publish(NEW_ROUTE_SEND_EMAIL_QUEUE, msg);
};

/**
 * @param  {Object} msg routeId
 */
MessageBus.prototype.publishStoreDuration = function (msg) {
    logger.info('Publish store duration', { extras: msg });
    this.connections.queue.publish(NEW_ROUTE_STORE_DURATION_QUEUE, msg);
};

/**
 * @param  {Object} msg routeId
 */
MessageBus.prototype.publishTakeRouteScreenshot = function (msg) {
    logger.info('Publish take route screenshot', { extras: msg });
    this.connections.queue.publish(NEW_ROUTE_TAKE_SCREENSHOT_QUEUE, msg);
};

/**
 * Handled by routes-api-graphql
 * @param  {object} msg {cityName: 'Boston'}
 */
MessageBus.prototype.publishClearRedisCache = function (msg) {
    logger.info('Publish clear redis cache for new route', { extras: msg });
    this.connections.queue.publish(NEW_ROUTE_INVALIDATE_REDIS, msg);
};

/**
 * @param  {object} msg {routeId}
 */
MessageBus.prototype.spiceVenuesInRoute = function (msg) {
    if (!msg.routeId) { throw new Error('Route is must be included'); }

    logger.info('Putting spices on route', { extras: msg });
    this.connections.queue.publish(NEW_ROUTE_PUT_SPICES_ON, msg);
};


module.exports = function createApp (config) {
    return new MessageBus(config);
};
