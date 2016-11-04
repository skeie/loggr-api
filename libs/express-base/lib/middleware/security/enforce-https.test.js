'use strict';

const enforceHttps = require('./enforce-https')();
const assert = require('power-assert');
const sinon = require('sinon');

describe('enforce https', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            method: 'GET',
            url: '/',
            headers: {
                host: 'hostname',
            },
        };

        res = {
            redirect: sinon.spy(),
        };

        next = sinon.spy();
    });

    it('should redirect', () => {
        enforceHttps(req, res, next);
        assert(!next.called);

        assert.deepEqual(res.redirect.firstCall.args, [301, 'https://hostname/?didRedirect=true']);
    });

    it('should call next if x-secure header is present', () => {
        req = Object.assign(req, {
            headers: {
                'x-secure': true,
            },
        });

        enforceHttps(req, res, next);
        assert(next.called);
    });

    it('should call next if host is missing', () => {
        req = Object.assign(req, {
            headers: {},
        });

        enforceHttps(req, res, next);
        assert(next.called);
    });

    it('should call next if request is not GET', () => {
        req = Object.assign(req, {
            method: 'FOO',
        });

        enforceHttps(req, res, next);
        assert(next.called);
    });

    it('should call next if didRedirect param is present', () => {
        req = Object.assign(req, {
            url: '/?didRedirect=true',
        });

        enforceHttps(req, res, next);
        assert(next.called);
    });
});
