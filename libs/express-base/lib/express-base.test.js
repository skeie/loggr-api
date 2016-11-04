'use strict';

const logger = require('../../fruits-logger');
const finnNodeExpress = require('./express-base');
const assert = require('power-assert');

const DEFAULT_CONFIG = {
    KUB_ENVIRONMENT: 'test',
    CSRF_PROTECTION_ENABLED: true,
    METRICS_ENABLED: false,
    ENFORCE_HTTPS_ENABLED: false,
};

function makeApp (config) {
    const app = finnNodeExpress.initialize({
        config: Object.assign({}, DEFAULT_CONFIG, config),
    });

    app.get('/', (req, res) => {
        res.sendStatus(200);
    });

    app.post('/echo-json', (req, res) => {
        res.send(req.body);
    });

    return app;
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

    it('should parse JSON', () => {
        const postBody = { foo: 'bar' };
        return request(makeApp({ CSRF_PROTECTION_ENABLED: false }))
            .post('/echo-json')
            .send(postBody)
            .then(({ body }) => {
                assert.deepEqual(body, postBody);
            });
    });

    it('should hide powered-by', () => (
        request(makeApp()).get('/')
            .then(({ headers }) => {
                assert(headers['x-powered-by'] === undefined);
            })
    ));

    it('should set security headers', () => (
        request(makeApp()).get('/')
            .then(({ headers }) => {
                assert(headers['x-download-options'] === 'noopen');
                assert(headers['x-content-type-options'] === 'nosniff');
                assert(headers['x-xss-protection'] === '1; mode=block');
                assert(headers['x-frame-options'] === 'SAMEORIGIN');
            })
    ));

    it('should redirect requests without X-Secure-header', () => (
        request(makeApp({ ENFORCE_HTTPS_ENABLED: true })).get('/foo?bar=1')
            .then(({ statusCode }) => {
                assert(statusCode === 301);
            })
    ));

    it('should add didRedirect param', () => (
        request(makeApp({ ENFORCE_HTTPS_ENABLED: true })).get('/foo?bar=1')
            .then(({ headers }) => {
                assert(headers.location === 'https://127.0.0.1/foo?bar=1&didRedirect=true');
            })
    ));

    it('should not redirect requests containing didRedirect param', () => (
        request(makeApp({ ENFORCE_HTTPS_ENABLED: true }))
            .get('/?didRedirect')
            .then(({ statusCode }) => {
                assert(statusCode < 300);
            })
    ));

    it('should not redirect requests containing X-Secure-header', () => (
        request(makeApp({ ENFORCE_HTTPS_ENABLED: true }))
            .get('/')
            .set('X-Secure', 'true')
            .then(({ statusCode }) => {
                assert(statusCode < 300);
            })
    ));

    it('should stop requests exceeding max content length', () => (
        request(makeApp({ MAX_CONTENT_LENGTH: 50 }))
            .get('/')
            .set('Content-Length', 51)
            .then(({ statusCode }) => {
                assert(statusCode === 400);
            })
    ));
});
