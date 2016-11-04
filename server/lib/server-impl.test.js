'use strict';

const serverImpl = require('./server-impl');
const logger = require('../../libs/fruits-logger');
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
};

function makeApp (config) {
    return serverImpl({
        config: Object.assign({}, DEFAULT_CONFIG, config),
        eventBus,
    });
}

const request = require('supertest-as-promised');

const nock = require('nock');

describe('server impl', () => {
    before(() => {
        logger.setLogLevel(logger.logLevels.OFF);

        nock.disableNetConnect();
        nock.enableNetConnect('localhost');
        nock.enableNetConnect('127.0.0.1');
    });

    after(() => {
        logger.setLogLevel(logger.logLevels.ON);
        nock.enableNetConnect();
    });

    it('should respond with 200', () => (
        request(makeApp()).get('/')
            .then(response => {
                assert(response.status === 200);
            })
    ));
});
