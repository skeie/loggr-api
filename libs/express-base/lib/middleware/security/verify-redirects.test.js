'use strict';

const logger = require('../../../../fruits-logger');
const verifyRedirects = require('./verify-redirects');
const assert = require('power-assert');
const sinon = require('sinon');

describe('verify redirects', () => {
    let req;
    let res;

    before(() => {
        logger.setLogLevel(logger.logLevels.OFF);
    });

    after(() => {
        logger.setLogLevel(logger.logLevels.ON);
    });

    beforeEach(() => {
        req = {
        };

        res = {
            get: sinon.stub(),
            set: sinon.spy(),
        };
    });

    it('should overwrite location', () => {
        res.get.withArgs('location').returns('https://my.location');
        verifyRedirects()(req, res);

        assert.deepEqual(res.set.firstCall.args, ['location', '/']);
    });

    it('should not overwrite location set to finn.no', () => {
        res.get.withArgs('location').returns('https://finn.no');
        verifyRedirects()(req, res);

        assert(!res.set.called);
    });

    it('should not overwrite relative redirect', () => {
        res.get.withArgs('location').returns('/foo/bar');
        verifyRedirects()(req, res);

        assert(!res.set.called);
    });

    it('should not overwrite location set to custom addition', () => {
        res.get.withArgs('location').returns('https://my.domain');
        verifyRedirects(['my.domain'])(req, res);

        assert(!res.set.called);
    });
});
