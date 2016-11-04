'use strict';

const MAX = 10;
const maxContentLength = require('./max-content-length')(MAX);
const logger = require('../../fruits-logger');
const assert = require('power-assert');
const sinon = require('sinon');

describe('max content length', () => {
    let req;
    let res;
    let next;

    before(() => {
        logger.setLogLevel(logger.logLevels.OFF);
    });

    after(() => {
        logger.setLogLevel(logger.logLevels.ON);
    });

    beforeEach(() => {
        req = {
            headers: {
                'content-length': MAX + 1,
            },
        };

        res = {
            sendStatus: sinon.spy(),
        };

        next = sinon.spy();
    });

    it('should send status 400 when content length exceeds max value', () => {
        maxContentLength(req, res, next);

        assert(!next.called);
        assert(res.sendStatus.calledWith(400));
    });

    it('should delegate to next when content length is below max value', () => {
        req = Object.assign(req, {
            headers: {
                'content-length': MAX,
            },
        });
        maxContentLength(req, res, next);

        assert(next.called);
    });
});
