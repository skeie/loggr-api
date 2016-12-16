'use strict';
const Promise = require('bluebird');
const serverImpl = require('../../lib/server-impl');
const logger = require('../../../libs/fruits-logger');
const assert = require('power-assert'); 
const noop = () => {};

const eventBus = {
    emit: noop,
    on: noop,
};

const DEFAULT_CONFIG = {
    KUB_ENVIRONMENT: 'test',
    CSRF_PROTECTION_ENABLED: true,
    METRICS_ENABLED: false,
    ENFORCE_HTTPS_ENABLED: false,
    LOG_LEVEL: 'TRACE',
    DB: 'postgres://postgres@localhost/routes-test',
    RABBIT: 'amqp://localhost'
};

function createTestApp (config) {
    return serverImpl({
        config: Object.assign({}, DEFAULT_CONFIG, config),
        eventBus,
    });
}

const nock = require('nock');

function setup() {
    logger.setLogLevel(logger.logLevels.OFF);

    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    nock.enableNetConnect('127.0.0.1');

    return Promise.resolve();
}

function teardown () {
    logger.setLogLevel(logger.logLevels.ON);
    nock.enableNetConnect();

    // returns Promise
    return require('./cleanUpDB')();
}

function getDbHandle () {
    return require('../../../libs/db-handler').initialize().db;
}

module.exports = {
    createTestApp,
    setup,
    teardown,
    getDbHandle
}