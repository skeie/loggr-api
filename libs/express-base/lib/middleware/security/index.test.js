'use strict';

const logger = require('../../../../fruits-logger');
const express = require('express');
const jsonParser = require('body-parser').json;
const cookieParser = require('cookie-parser');
const security = require('./index');
const assert = require('power-assert');
const request = require('supertest-as-promised');

const BAD_TOKEN_STATUS_CODE = 400;

function makeApp (config = {}) {
    const app = express();
    app.use(jsonParser());
    app.use(cookieParser());
    app.use(security(Object.assign({
        csrfProtection: false,
        enforceHttps: false,
        maxContentLength: 100,
        validateRedirectHostnamesWhitelist: [],
        validateRedirects: false,
        enableGlobalCors: true,
    }, config)));

    app.use((err, req, res, next) => {
        if (err) {
            if (err.code === 'EBADCSRFTOKEN') {
                return res.sendStatus(BAD_TOKEN_STATUS_CODE);
            }

            return res.sendStatus(500);
        }
        next();
    });

    app.get('/', (req, res) => {
        res.json({
            csrfToken: req.csrfToken(),
        });
    });

    app.get('/internal-backstage', (req, res) => {
        res.sendStatus(204);
    });

    app.get('/blank', (req, res) => {
        res.sendStatus(200);
    });

    app.get('/redirectMe', (req, res) => {
        res.redirect(req.query.to);
    });

    app.post('/', (req, res) => {
        res.sendStatus(200);
    });

    return app;
}

describe('security', () => {
    before(() => {
        logger.setLogLevel(logger.logLevels.OFF);
    });

    after(() => {
        logger.setLogLevel(logger.logLevels.ON);
    });

    describe('validate CSRF token', () => {
        let agent;
        let app;

        before(() => {
            app = makeApp({
                csrfProtection: true,
            });
            agent = request.agent(app);
        });

        it('should stop POST requests without CSRF-token', () => (
            agent
                .post('/')
                .then(({ statusCode }) => {
                    assert(statusCode === BAD_TOKEN_STATUS_CODE);
                })
        ));
    });

    describe('enforcing https', () => {
        it('should redirect http to https', () => {
            request(makeApp({
                enforceHttps: true,
            }))
                .get('/')
                .then(({ statusCode }) => {
                    assert(statusCode === 301);
                });
        });

        it('should not redirect internal-backstage urls', () => {
            request(makeApp({
                enforceHttps: true,
            }))
                .get('/internal-backstage')
                .then(({ statusCode }) => {
                    assert(statusCode === 204);
                });
        });
    });

    describe('redirect verification', () => {
        it('should stop illegal redirect', () => (
            request(makeApp({
                validateRedirects: true,
            }))
                .get('/redirectMe?to=http://anothersite')
                .then(response => {
                    assert(response.headers.location === '/');
                })
        ));
    });

    describe('CORS', () => {
        it('should add CORS headers', () => (
            request(makeApp({
                enableGlobalCors: true,
            }))
                .get('/blank')
                .then(response => {
                    assert(response.headers['access-control-allow-origin'] === '*');
                    assert(response.headers['access-control-allow-headers'] === 'Origin, X-Requested-With, Content-Type, Accept');
                })
        ));

        it('should NOT add CORS headers', () => (
            request(makeApp({
                enableGlobalCors: false,
            }))
                .get('/blank')
                .then(response => {
                    assert(response.headers['access-control-allow-origin'] === undefined);
                    assert(response.headers['access-control-allow-headers'] === undefined);
                })
        ));
    });
});
