/**
 * MESSAGE BUS
 * ------------
 * Publishers, and handlers should be next to each other
 */
const logger = require('./fruits-logger');
const Promise = require('bluebird');
const uuid = require('node-uuid');
const EventEmitter = require('events').EventEmitter;

const connections = require('./connections');

const EXAMPLE_QUEUE = 'jobs.EXAMPLE_QUEUE';

function MessageBus (config) {
    EventEmitter.call(this);

    this.config = config;
    this.connections = connections(config);
    this.connections.once('ready', this.onConnected.bind(this));
    this.connections.once('lost', this.onLost.bind(this));
}

MessageBus.prototype = Object.create(EventEmitter.prototype);

MessageBus.prototype.onConnected = function () {
    let queues = 0;
    const QUEUE_COUNT = 1;
    this.connections.queue.create(EXAMPLE_QUEUE, { prefetch: 5 }, onCreate.bind(this));

    function onCreate () {
        if (++queues === QUEUE_COUNT) { this.onReady(); }
    }
};

MessageBus.prototype.onReady = function () {
    logger.info('App ready');
    this.emit('ready');
};

MessageBus.prototype.onLost = function () {
    logger.info('app.lost');
    this.emit('lost');
};

MessageBus.prototype.subscribeToMessageBus = function () {
    this.connections.queue.handle(EXAMPLE_QUEUE, this.handlePublishExampleJob.bind(this));
    return this;
};

MessageBus.prototype.publishExampleJob = function (requestId) {    
    this.connections.queue.publish(EXAMPLE_QUEUE, { requestId });
    return Promise.resolve(requestId);
};

MessageBus.prototype.handlePublishExampleJob = function (job, ack) {
    logger.log({ type: 'info', msg: 'handling job', queue: EXAMPLE_QUEUE, url: job.url });
    
    onSuccess();

    function onSuccess () {
        logger.info({ type: 'info', msg: 'job complete', status: 'success', url: job.url });
        ack();
    }

    // function onError () {
    //     logger.info({ type: 'info', msg: 'job complete', status: 'failure', url: job.url });
    //     ack();
    // }
};

module.exports = function createApp (config) {
    return new MessageBus(config);
};
